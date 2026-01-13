import { sequelize } from '../../db/index.js';
import { Op } from 'sequelize';
import bcrypt from 'bcrypt';
import nodemailer from 'nodemailer';
import AdminUser from '../../adminuser/models/adminuser.model.js';
import Teacher from '../models/teacher.models.js';


const createTeacher = async (payload, { transaction: externalTx = null, sendEmail = true } = {}) => {
  const tx = externalTx || await sequelize.transaction();
  let committed = false;
  try {
    const email = payload.email ? String(payload.email).toLowerCase() : null;
    const phone = payload.number || payload.phone || null;
    const name = payload.name || 'teacher';

    let adminUser = null;
    let plainPassword = null;

    if (email) {
      adminUser = await AdminUser.findOne({ where: { email }, transaction: tx, paranoid: false });
    }

    if (!adminUser) {
      if (!email || !phone) {
        console.warn('createTeacher: email or phone missing — admin user will not be created/linked.');
      } else {
        // Use phone as plain password (as requested) but store hashed
        plainPassword = String(phone);
        const saltRounds = 10;
        const hashed = await bcrypt.hash(plainPassword, saltRounds);

        const adminPayload = {
          username: name,
          email,
          phone,
          password: hashed,
          role: 'Teacher',
          is_active: typeof payload.is_active !== 'undefined' ? payload.is_active : true,
          created_by: payload.created_by || null,
          created_by_name: payload.created_by_name || null,
          created_by_email: payload.created_by_email || null,
        };

        adminUser = await AdminUser.create(adminPayload, { transaction: tx });
      }
    } else {
      // admin user exists — we will not overwrite password. But if user existed and no plainPassword set,
      // we do not send a new password. Optionally you could reset the password here (not implemented).
      // plainPassword remains null so we won't email a password.
    }

    // link admin user id to teacher payload if available
    if (adminUser && adminUser.id) {
      payload.user_id = adminUser.id;
    }

    const teacher = await Teacher.create(payload, { transaction: tx });

    if (!externalTx) {
      await tx.commit();
      committed = true;
    }

    // After commit: send email (do not roll back DB on email failures)
    let emailError = null;
    if (sendEmail && email && adminUser) {
      try {
        // Build transporter from environment variables
        const host = process.env.SMTP_HOST;
        const port = process.env.SMTP_PORT ? Number(process.env.SMTP_PORT) : undefined;
        const user = process.env.SMTP_USER;
        const pass = process.env.SMTP_PASS;
        const from = process.env.FROM_EMAIL || user;
        // infer secure from port if not explicitly set
        const secureEnv = typeof process.env.SMTP_SECURE !== 'undefined' ? (String(process.env.SMTP_SECURE).toLowerCase() === 'true') : undefined;
        const secure = typeof secureEnv !== 'undefined' ? secureEnv : (port === 465);

        if (!host || !port || !user || !pass) {
          throw new Error('SMTP configuration missing (SMTP_HOST/SMTP_PORT/SMTP_USER/SMTP_PASS)');
        }

        const transporter = nodemailer.createTransport({
          host,
          port,
          secure,
          auth: {
            user,
            pass,
          },
        });

        // Compose email
        // If plainPassword is null (user existed), we'll send only a notice that account exists.
        let htmlBody;
        if (plainPassword) {
          htmlBody = `
            <p>Hi ${name},</p>
            <p>Your teacher account has been created. You can login with the credentials below:</p>
            <ul>
              <li><strong>Email:</strong> ${email}</li>
              <li><strong>Password:</strong> ${plainPassword}</li>
            </ul>
            <p>Please change your password after first login.</p>
            <p>-- Admin</p>
          `;
        } else {
          htmlBody = `
            <p>Hi ${name},</p>
            <p>An account already exists for <strong>${email}</strong>. If you've forgotten your password please use the \"Forgot password\" flow to reset it.</p>
            <p>-- Admin</p>
          `;
        }

        const info = await transporter.sendMail({
          from,
          to: email,
          subject: 'Teacher account created',
          html: htmlBody,
        });

        // optionally log messageId or preview URL
        console.log('createTeacher: email sent', info.messageId ?? info);
      } catch (err) {
        console.error('createTeacher: failed to send email', err);
        emailError = err;
      }
    }

    // return teacher and meta about created user & email status
    return {
      teacher,
      linkedAdminUserId: adminUser ? adminUser.id : null,
      emailError,
    };
  } catch (err) {
    if (!externalTx && !committed) await tx.rollback();
    throw err;
  }
};

const updateTeacher = async (id, payload, { transaction: externalTx = null } = {}) => {
  const tx = externalTx || await sequelize.transaction();
  try {
    const [updatedCount] = await Teacher.update(payload, { where: { id }, transaction: tx });
    if (updatedCount === 0) throw new Error('Teacher not found');
    const updated = await Teacher.findByPk(id, { transaction: tx });
    if (!externalTx) await tx.commit();
    return updated;
  } catch (err) {
    if (!externalTx) await tx.rollback();
    throw err;
  }
};


const buildWhere = ({ filters = {}, search, startDate, endDate, is_master } = {}) => {
  const where = {};

  Object.keys(filters || {}).forEach((key) => {
    const val = filters[key];
    if (val === null || typeof val === 'undefined') return;
    // If array passed, use IN
    if (Array.isArray(val)) where[key] = { [Op.in]: val };
    else where[key] = val;
  });

  // is_master convenience
  if (typeof is_master !== 'undefined') {
    if (is_master) where.desgination = 'Head Master';
    else {
      // if explicitly false, exclude Head Master
      where.desgination = { [Op.ne]: 'Head Master' };
    }
  }

  // date range filter on hire_date
  if (startDate || endDate) {
    where.hire_date = {};
    if (startDate) where.hire_date[Op.gte] = new Date(startDate);
    if (endDate) where.hire_date[Op.lte] = new Date(endDate);
  }

  // free text search across some columns
  if (search) {
    const like = { [Op.iLike || Op.like]: `%${search}%` };
    where[Op.or] = [
      { qualification: { [Op.iLike || Op.like]: `%${search}%` } },
      { desgination: { [Op.iLike || Op.like]: `%${search}%` } },
      { created_by_name: { [Op.iLike || Op.like]: `%${search}%` } },
      { created_by_email: { [Op.iLike || Op.like]: `%${search}%` } },
      sequelize.where(sequelize.cast(sequelize.col('subjects'), 'text'), { [Op.iLike || Op.like]: `%${search}%` }),
    ];
  }

  return where;
};

const getTeachers = async (options = {}) => {
  const {
    page = 1,
    limit = 10,
    filters,
    search,
    startDate,
    endDate,
    is_master,
    includeAudit = false,
    includeDeleted = false,
    order = [['createdAt', 'DESC']],
  } = options;

  const where = buildWhere({ filters, search, startDate, endDate, is_master });

  // attributes: include audit fields if requested, otherwise exclude some heavy fields if desired
  const baseAttrs = [
    'id', 'user_id', 'qualification', 'hire_date', 'subjects', 'desgination', 'salary', 'is_active',
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

  if (includeDeleted) findOptions.paranoid = false; // include soft-deleted rows

  const { count, rows } = await Teacher.findAndCountAll(findOptions);

  const totalPages = Math.max(1, Math.ceil(count / limit));
  return {
    rows,
    count,
    page: Number(page),
    limit: Number(limit),
    totalPages,
  };
};

const getTeacherById = async (id, { includeDeleted = false, includeAudit = true } = {}) => {
  const opts = {};
  if (includeDeleted) opts.paranoid = false;
  if (!includeAudit) opts.attributes = { exclude: ['created_by', 'created_by_name', 'created_by_email', 'updated_by', 'updated_by_name', 'updated_by_email', 'deleted_by', 'deleted_by_name', 'deleted_by_email'] };
  const teacher = await Teacher.findByPk(id, opts);
  if (!teacher) throw new Error('Teacher not found');
  return teacher;
};

const deleteTeacher = async (id, deletedByMeta = {}, { transaction: externalTx = null } = {}) => {
  const tx = externalTx || await sequelize.transaction();
  try {
    await Teacher.update({
      deleted_by: deletedByMeta.deleted_by || null,
      deleted_by_name: deletedByMeta.deleted_by_name || null,
      deleted_by_email: deletedByMeta.deleted_by_email || null,
    }, { where: { id }, transaction: tx });

    const t = await Teacher.findByPk(id, { transaction: tx });
    if (!t) throw new Error('Teacher not found');
    await t.destroy({ transaction: tx });
    if (!externalTx) await tx.commit();
    return true;
  } catch (err) {
    if (!externalTx) await tx.rollback();
    throw err;
  }
};

const restoreTeacher = async (id, restoredByMeta = {}, { transaction: externalTx = null } = {}) => {
  const tx = externalTx || await sequelize.transaction();
  try {
    const restored = await Teacher.restore({ where: { id }, transaction: tx });
    await Teacher.update({
      deleted_by: null,
      deleted_by_name: null,
      deleted_by_email: null,
      updated_by: restoredByMeta.updated_by || null,
      updated_by_name: restoredByMeta.updated_by_name || null,
      updated_by_email: restoredByMeta.updated_by_email || null,
    }, { where: { id }, transaction: tx });

    const teacher = await Teacher.findByPk(id, { transaction: tx });
    if (!externalTx) await tx.commit();
    return teacher;
  } catch (err) {
    if (!externalTx) await tx.rollback();
    throw err;
  }
};

export default {
  createTeacher,
  updateTeacher,
  getTeachers,
  getTeacherById,
  deleteTeacher,
  restoreTeacher,
};
