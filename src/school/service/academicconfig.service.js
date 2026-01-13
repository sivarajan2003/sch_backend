// academicconfig.service.js
import { sequelize } from '../../db/index.js';
import { Op } from 'sequelize';
import nodemailer from 'nodemailer';
import Academicyearconfig from '../models/academicconfig.models.js';
import Class from '../models/class.models.js';
import Academicyear from '../models/academicyear.models.js';
import Teacher from '../../teacher/models/teacher.models.js';

const createAcademicConfig = async (payload, { transaction: externalTx = null, sendEmail = true } = {}) => {
  const tx = externalTx || await sequelize.transaction();
  let committed = false;
  try {
    const existingConfig = await Academicyearconfig.findOne({
      where: {
        academicyear_id: payload.academicyear_id,
        class_id: payload.class_id,
      },
      transaction: tx,
      paranoid: false,
    });

    if (existingConfig) throw new Error("This configuration is already done for the given Academic Year and Class");

    const config = await Academicyearconfig.create(payload, { transaction: tx });

    if (!externalTx) {
      await tx.commit();
      committed = true;
    }

    // notify class teacher after commit (if requested)
    let emailError = null;
    let emailSent = false;

    if (sendEmail && config.class_teacher_id) {
      try {
        const teacher = await Teacher.findByPk(config.class_teacher_id, { paranoid: false });
        if (teacher && teacher.email) {
          const klass = config.class_id ? await Class.findByPk(config.class_id, { paranoid: false }) : null;
          const ay = config.academicyear_id ? await Academicyear.findByPk(config.academicyear_id, { paranoid: false }) : null;

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

          const teacherName = teacher.name || 'Teacher';
          const className = klass ? `${klass.name}${klass.section ? ' - ' + klass.section : ''}` : 'your class';
          const ayName = ay ? ay.yearsbyname || '' : '';

          const htmlBody = `
            <p>Hi ${teacherName},</p>
            <p>This is to inform you that you have been assigned as the <strong>Class Teacher</strong> for <strong>${className}</strong>${ayName ? ` for Academic Year <strong>${ayName}</strong>` : ''}.</p>
            <p>Please check the teacher portal for more details.</p>
            <p>If you did not expect this assignment, contact the administration.</p>
            <p>-- Admin</p>
          `;

          const info = await transporter.sendMail({
            from,
            to: teacher.email,
            subject: `Assigned: Class Teacher — ${className}${ayName ? ` (${ayName})` : ''}`,
            html: htmlBody,
          });

          console.log('createAcademicConfig: teacher notification email sent', info.messageId ?? info);
          emailSent = true;
        } else {
          console.warn('createAcademicConfig: teacher not found or teacher.email missing — skipping email');
        }
      } catch (err) {
        console.error('createAcademicConfig: failed to send teacher email', err);
        emailError = err;
      }
    }

    return { config, emailSent, emailError };
  } catch (err) {
    if (!externalTx && !committed) await tx.rollback();
    throw err;
  }
};

const updateAcademicConfig = async (id, payload, { transaction: externalTx = null } = {}) => {
  const tx = externalTx || await sequelize.transaction();
  try {
    const [updatedCount] = await Academicyearconfig.update(payload, { where: { id }, transaction: tx });
    if (updatedCount === 0) throw new Error('AcademicyearConfig not found');
    const updated = await Academicyearconfig.findByPk(id, { transaction: tx });
    if (!externalTx) await tx.commit();
    return updated;
  } catch (err) {
    if (!externalTx) await tx.rollback();
    throw err;
  }
};

const buildWhere = ({ filters = {}, search, startDate, endDate, academicyear_id, class_id, class_teacher_id, is_active } = {}) => {
  const where = {};

  Object.keys(filters || {}).forEach((key) => {
    const val = filters[key];
    if (val === null || typeof val === 'undefined') return;
    if (Array.isArray(val)) where[key] = { [Op.in]: val };
    else where[key] = val;
  });

  if (typeof is_active !== 'undefined') where.is_active = is_active;
  if (academicyear_id) where.academicyear_id = academicyear_id;
  if (class_id) where.class_id = class_id;
  if (class_teacher_id) where.class_teacher_id = class_teacher_id;

  if (startDate || endDate) {
    where.createdAt = {};
    if (startDate) where.createdAt[Op.gte] = new Date(startDate);
    if (endDate) where.createdAt[Op.lte] = new Date(endDate);
  }

  if (search) {
    const ilikeOp = Op.iLike || Op.like;
    const pattern = `%${search}%`;
    where[Op.or] = [
      { nameofconfig: { [ilikeOp]: pattern } },
      sequelize.where(sequelize.cast(sequelize.col('fees'), 'text'), { [ilikeOp]: pattern }),
      { created_by_name: { [ilikeOp]: pattern } },
      { created_by_email: { [ilikeOp]: pattern } },
    ];
  }

  return where;
};

const getAcademicConfigs = async (options = {}) => {
  const {
    page = 1,
    limit = 10,
    filters,
    search,
    startDate,
    endDate,
    academicyear_id,
    class_id,
    class_teacher_id,
    is_active,
    includeAudit = false,
    includeDeleted = false,
    order = [['createdAt', 'DESC']],
  } = options;

  const where = buildWhere({ filters, search, startDate, endDate, academicyear_id, class_id, class_teacher_id, is_active });

  const baseAttrs = ['id', 'academicyear_id', 'class_id', 'class_teacher_id', 'fees', 'nameofconfig', 'is_active'];
  const auditAttrs = [
    'created_by', 'created_by_name', 'created_by_email',
    'updated_by', 'updated_by_name', 'updated_by_email',
    'deleted_by', 'deleted_by_name', 'deleted_by_email',
  ];
  const attributes = includeAudit ? baseAttrs.concat(auditAttrs) : baseAttrs;

  const { count, rows } = await Academicyearconfig.findAndCountAll({
    where,
    attributes,
    order,
    offset: (page - 1) * limit,
    limit: Number(limit),
    distinct: true,
    paranoid: !includeDeleted,
  });

  // Collect IDs for batch queries
  const yearIds = [...new Set(rows.map(r => r.academicyear_id).filter(Boolean))];
  const classIds = [...new Set(rows.map(r => r.class_id).filter(Boolean))];
  const teacherIds = [...new Set(rows.map(r => r.class_teacher_id).filter(Boolean))];

  // Fetch related data
  const years = await Academicyear.findAll({ where: { id: yearIds }, paranoid: !includeDeleted });
  const classes = await Class.findAll({ where: { id: classIds }, paranoid: !includeDeleted });
  const teachers = await Teacher.findAll({ where: { id: teacherIds }, paranoid: !includeDeleted });

  // Convert to map for fast lookup
  const yearMap = Object.fromEntries(years.map(y => [y.id, y.toJSON()]));
  const classMap = Object.fromEntries(classes.map(c => [c.id, c.toJSON()]));
  const teacherMap = Object.fromEntries(teachers.map(t => [t.id, t.toJSON()]));

  // Attach manually
  const rowsWithRelations = rows.map(r => {
    const plain = r.toJSON();
    plain.academicyear = yearMap[plain.academicyear_id] || null;
    plain.class = classMap[plain.class_id] || null;
    plain.teacher = teacherMap[plain.class_teacher_id] || null;
    return plain;
  });

  return {
    rows: rowsWithRelations,
    count,
    page: Number(page),
    limit: Number(limit),
    totalPages: Math.max(1, Math.ceil(count / limit)),
  };
};


const getAcademicConfigById = async (id, { includeDeleted = false, includeAudit = true } = {}) => {
  const opts = {};
  if (includeDeleted) opts.paranoid = false;
  if (!includeAudit) {
    opts.attributes = {
      exclude: [
        'created_by', 'created_by_name', 'created_by_email',
        'updated_by', 'updated_by_name', 'updated_by_email',
        'deleted_by', 'deleted_by_name', 'deleted_by_email',
      ],
    };
  }

  const item = await Academicyearconfig.findByPk(id, opts);
  if (!item) throw new Error('AcademicyearConfig not found');

  const plain = item.toJSON();

  // Fetch related manually
  if (plain.academicyear_id) {
    plain.academicyear = await Academicyear.findByPk(plain.academicyear_id, { paranoid: !includeDeleted });
  }
  if (plain.class_id) {
    plain.class = await Class.findByPk(plain.class_id, { paranoid: !includeDeleted });
  }
  if (plain.class_teacher_id) {
    plain.teacher = await Teacher.findByPk(plain.class_teacher_id, { paranoid: !includeDeleted });
  }

  return plain;
};



const deleteAcademicConfig = async (id, deletedByMeta = {}, { transaction: externalTx = null } = {}) => {
  const tx = externalTx || await sequelize.transaction();
  try {
    await Academicyearconfig.update({
      deleted_by: deletedByMeta.deleted_by || null,
      deleted_by_name: deletedByMeta.deleted_by_name || null,
      deleted_by_email: deletedByMeta.deleted_by_email || null,
    }, { where: { id }, transaction: tx });

    const item = await Academicyearconfig.findByPk(id, { transaction: tx });
    if (!item) throw new Error('AcademicyearConfig not found');
    await item.destroy({ transaction: tx });
    if (!externalTx) await tx.commit();
    return true;
  } catch (err) {
    if (!externalTx) await tx.rollback();
    throw err;
  }
};

const restoreAcademicConfig = async (id, restoredByMeta = {}, { transaction: externalTx = null } = {}) => {
  const tx = externalTx || await sequelize.transaction();
  try {
    await Academicyearconfig.restore({ where: { id }, transaction: tx });
    await Academicyearconfig.update({
      deleted_by: null,
      deleted_by_name: null,
      deleted_by_email: null,
      updated_by: restoredByMeta.updated_by || null,
      updated_by_name: restoredByMeta.updated_by_name || null,
      updated_by_email: restoredByMeta.updated_by_email || null,
    }, { where: { id }, transaction: tx });

    const item = await Academicyearconfig.findByPk(id, { transaction: tx });
    if (!externalTx) await tx.commit();
    return item;
  } catch (err) {
    if (!externalTx) await tx.rollback();
    throw err;
  }
};

export default {
  createAcademicConfig,
  updateAcademicConfig,
  getAcademicConfigs,
  getAcademicConfigById,
  deleteAcademicConfig,
  restoreAcademicConfig,
};
