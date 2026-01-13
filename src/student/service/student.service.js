// student.service.js
import { sequelize } from '../../db/index.js';
import { Op } from 'sequelize';
import nodemailer from 'nodemailer';
import Student from '../models/student.models.js';
import Parent from '../../parent/models/parent.models.js';
import Academicyearconfig from '../../school/models/academicconfig.models.js';

const createStudent = async (payload, { transaction: externalTx = null, sendEmail = true } = {}) => {
  const tx = externalTx || await sequelize.transaction();
  let committed = false;
  try {
    // Normalize some fields
    const name = payload.name || 'Student';
    const parentId = payload.parent_id || null;
    const academicConfigId = payload.current_academic_config_id || null;

    // --- Auto-calculate age from date_of_birth (if provided) ---
    if (payload.date_of_birth) {
      try {
        // coerce to Date object
        const dob = new Date(payload.date_of_birth);
        if (!Number.isNaN(dob.getTime())) {
          const today = new Date();
          let age = today.getFullYear() - dob.getFullYear();
          const m = today.getMonth() - dob.getMonth();
          if (m < 0 || (m === 0 && today.getDate() < dob.getDate())) {
            age -= 1;
          }
          // ensure non-negative integer
          payload.age = age >= 0 ? Math.floor(age) : 0;
        } else {
          // invalid date -> don't set age (leave to DB / further validation)
          console.warn('createStudent: invalid date_of_birth, skipping age calculation');
        }
      } catch (err) {
        console.warn('createStudent: failed to calculate age from date_of_birth', err);
      }
    }

    // create student
    const student = await Student.create(payload, { transaction: tx });

    if (!externalTx) {
      await tx.commit();
      committed = true;
    }

    // After commit: send email to parent (if available)
    let emailError = null;
    let emailSent = false;
    if (sendEmail && parentId) {
      try {
        const parent = await Parent.findByPk(parentId, { paranoid: false });
        if (parent && parent.email) {
          // best-effort fetch academic config
          let academicConfig = null;
          try {
            if (academicConfigId) {
              academicConfig = await Academicyearconfig.findByPk(academicConfigId, { paranoid: false });
            }
          } catch (err) {
            console.warn('createStudent: failed fetching academic config', err);
          }

          const host = process.env.SMTP_HOST;
          const port = process.env.SMTP_PORT ? Number(process.env.SMTP_PORT) : undefined;
          const user = process.env.SMTP_USER;
          const pass = process.env.SMTP_PASS;
          const from = process.env.FROM_EMAIL || user;
          const secureEnv = typeof process.env.SMTP_SECURE !== 'undefined' ? (String(process.env.SMTP_SECURE).toLowerCase() === 'true') : undefined;
          const secure = typeof secureEnv !== 'undefined' ? secureEnv : (port === 465);

          if (!host || !port || !user || !pass) {
            throw new Error('SMTP configuration missing (SMTP_HOST/SMTP_PORT/SMTP_USER/SMTP_PASS)');
          }

          const transporter = nodemailer.createTransport({
            host,
            port,
            secure,
            auth: { user, pass },
          });

          const childDisplay = student.name || 'your child';
          const pronoun = (student.gender && String(student.gender).toLowerCase() === 'female') ? 'daughter' : 'son';
          const parentName = parent.name || 'Parent';

          let configText = '';
          if (academicConfig) {
            const feesText = (academicConfig.fees !== undefined && academicConfig.fees !== null) ? `${academicConfig.fees}` : 'N/A';
            const nameText = academicConfig.nameofconfig || '—';
            configText = `<p>Academic Config: <strong>${nameText}</strong><br/>Configured Fees: <strong>${feesText}</strong></p>`;
          }

          const htmlBody = `
            <p>Hi ${parentName},</p>
            <p>We are pleased to inform you that your ${pronoun} <strong>${childDisplay}</strong> has been admitted successfully.</p>
            ${configText}
            <p>Please <strong>check the parent portal</strong> to confirm if any fees are pending or to view admission details.</p>
            <p>If you have questions, contact the school administration.</p>
            <p>-- Admin</p>
          `;

          const info = await transporter.sendMail({
            from,
            to: parent.email,
            subject: `Admission successful: ${childDisplay}`,
            html: htmlBody,
          });

          console.log('createStudent: parent notification email sent', info.messageId ?? info);
          emailSent = true;
        } else {
          console.warn('createStudent: parent not found or parent.email missing — skipping email');
        }
      } catch (err) {
        console.error('createStudent: failed to send parent email', err);
        emailError = err;
      }
    } else {
      if (sendEmail && !parentId) {
        console.warn('createStudent: parent_id not provided — skipping parent email');
      }
    }

    return {
      student,
      emailSent,
      emailError,
    };
  } catch (err) {
    if (!externalTx && !committed) await tx.rollback();
    throw err;
  }
};


const updateStudent = async (id, payload, { transaction: externalTx = null } = {}) => {
  const tx = externalTx || await sequelize.transaction();
  try {
    const [updatedCount] = await Student.update(payload, { where: { id }, transaction: tx });
    if (updatedCount === 0) throw new Error('Student not found');
    const updated = await Student.findByPk(id, { transaction: tx });
    if (!externalTx) await tx.commit();
    return updated;
  } catch (err) {
    if (!externalTx) await tx.rollback();
    throw err;
  }
};

const buildWhere = ({ filters = {}, search, startDate, endDate, current_academic_config_id, academic_year } = {}) => {
  const where = {};

  Object.keys(filters || {}).forEach((key) => {
    const val = filters[key];
    if (val === null || typeof val === 'undefined') return;
    if (Array.isArray(val)) where[key] = { [Op.in]: val };
    else where[key] = val;
  });

  if (typeof current_academic_config_id !== 'undefined' && current_academic_config_id !== null) where.current_academic_config_id = current_academic_config_id;
  if (academic_year) where.academic_year = academic_year;

  // admission_date or createdAt date range
  if (startDate || endDate) {
    where.admission_date = {};
    if (startDate) where.admission_date[Op.gte] = new Date(startDate);
    if (endDate) where.admission_date[Op.lte] = new Date(endDate);
  }

  if (search) {
    const ilikeOp = Op.iLike || Op.like;
    const pattern = `%${search}%`;
    where[Op.or] = [
      { name: { [ilikeOp]: pattern } },
      { admission_number: { [ilikeOp]: pattern } },
      sequelize.where(sequelize.cast(sequelize.col('roll_number'), 'text'), { [ilikeOp]: pattern }),
      { academic_year: { [ilikeOp]: pattern } },
      { created_by_name: { [ilikeOp]: pattern } },
      { created_by_email: { [ilikeOp]: pattern } },
      { address: { [ilikeOp]: pattern } },
    ];
  }

  return where;
};

const getStudents = async (options = {}) => {
  const {
    page = 1,
    limit = 10,
    filters,
    search,
    startDate,
    endDate,
    current_academic_config_id,
    academic_year,
    includeAudit = false,
    includeDeleted = false,
    order = [['createdAt', 'DESC']],
    includeParent = false,
    includeAcademicConfig = false,
  } = options;

  const where = buildWhere({ filters, search, startDate, endDate, current_academic_config_id, academic_year });

  const baseAttrs = [
    'id', 'name', 'age', 'gender', 'address', 'date_of_birth',
    'parent_id', 'current_academic_config_id', 'yearofjoining', 'roll_number',
    'blood_group', 'admission_number', 'admission_date',
    'profile_image', 'academic_year', 'is_active',
  ];
  const auditAttrs = [
    'created_by', 'created_by_name', 'created_by_email',
    'updated_by', 'updated_by_name', 'updated_by_email',
    'deleted_by', 'deleted_by_name', 'deleted_by_email',
  ];
  const attributes = includeAudit ? baseAttrs.concat(auditAttrs) : baseAttrs;

  const findOptions = {
    where,
    attributes,
    order,
    offset: (page - 1) * limit,
    limit: Number(limit),
  };

  if (includeDeleted) findOptions.paranoid = false;

  // build include array as needed
  const include = [];
  if (includeParent) {
    include.push({
      model: Parent,
      as: 'Parent',
      attributes: ['id', 'name', 'email', 'phone'],
      required: false,
    });
  }
  if (includeAcademicConfig) {
    include.push({
      model: Academicyearconfig,
      as: 'AcademicConfig',
      attributes: ['id', 'nameofconfig', 'fees', 'academicyear_id', 'class_id', 'class_teacher_id'],
      required: false,
    });
  }
  if (include.length > 0) findOptions.include = include;

  const { count, rows } = await Student.findAndCountAll(findOptions);
  const totalPages = Math.max(1, Math.ceil(count / limit));
  return {
    rows,
    count,
    page: Number(page),
    limit: Number(limit),
    totalPages,
  };
};

const getStudentById = async (id, { includeDeleted = false, includeAudit = true, includeParent = true, includeAcademicConfig = true } = {}) => {
  const opts = {};
  if (includeDeleted) opts.paranoid = false;
  if (!includeAudit) opts.attributes = { exclude: ['created_by', 'created_by_name', 'created_by_email', 'updated_by', 'updated_by_name', 'updated_by_email', 'deleted_by', 'deleted_by_name', 'deleted_by_email'] };

  const include = [];
  if (includeParent) {
    include.push({
      model: Parent,
      as: 'Parent',
      attributes: ['id', 'name', 'email', 'phone'],
      required: false,
    });
  }
  if (includeAcademicConfig) {
    include.push({
      model: Academicyearconfig,
      as: 'AcademicConfig',
      attributes: ['id', 'nameofconfig', 'fees', 'academicyear_id', 'class_id', 'class_teacher_id'],
      required: false,
    });
  }
  if (include.length > 0) opts.include = include;

  const student = await Student.findByPk(id, opts);
  if (!student) throw new Error('Student not found');
  return student;
};

const deleteStudent = async (id, deletedByMeta = {}, { transaction: externalTx = null } = {}) => {
  const tx = externalTx || await sequelize.transaction();
  try {
    await Student.update({
      deleted_by: deletedByMeta.deleted_by || null,
      deleted_by_name: deletedByMeta.deleted_by_name || null,
      deleted_by_email: deletedByMeta.deleted_by_email || null,
    }, { where: { id }, transaction: tx });

    const s = await Student.findByPk(id, { transaction: tx });
    if (!s) throw new Error('Student not found');
    await s.destroy({ transaction: tx });
    if (!externalTx) await tx.commit();
    return true;
  } catch (err) {
    if (!externalTx) await tx.rollback();
    throw err;
  }
};

const restoreStudent = async (id, restoredByMeta = {}, { transaction: externalTx = null } = {}) => {
  const tx = externalTx || await sequelize.transaction();
  try {
    await Student.restore({ where: { id }, transaction: tx });
    await Student.update({
      deleted_by: null,
      deleted_by_name: null,
      deleted_by_email: null,
      updated_by: restoredByMeta.updated_by || null,
      updated_by_name: restoredByMeta.updated_by_name || null,
      updated_by_email: restoredByMeta.updated_by_email || null,
    }, { where: { id }, transaction: tx });

    const student = await Student.findByPk(id, { transaction: tx });
    if (!externalTx) await tx.commit();
    return student;
  } catch (err) {
    if (!externalTx) await tx.rollback();
    throw err;
  }
};

export default {
  createStudent,
  updateStudent,
  getStudents,
  getStudentById,
  deleteStudent,
  restoreStudent,
};
