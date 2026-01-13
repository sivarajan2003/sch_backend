// parent.service.js
import { sequelize } from '../../db/index.js';
import { Op } from 'sequelize';
import bcrypt from 'bcrypt';
import nodemailer from 'nodemailer';
import AdminUser from '../../adminuser/models/adminuser.model.js';
import Parent from '../models/parent.models.js';

const createParent = async (payload, { transaction: externalTx = null, sendEmail = true } = {}) => {
  const tx = externalTx || await sequelize.transaction();
  let committed = false;
  try {
    const email = payload.email ? String(payload.email).toLowerCase() : null;
    // support both `phone` and legacy `number`
    const phone = payload.phone || payload.number || null;
    const name = payload.name || 'parent';

    let adminUser = null;
    let plainPassword = null;

    if (email) {
      adminUser = await AdminUser.findOne({ where: { email }, transaction: tx, paranoid: false });
    }

    if (!adminUser) {
      if (!email || !phone) {
        console.warn('createParent: email or phone missing — admin user will not be created/linked.');
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
          role: 'Parent',
          is_active: typeof payload.is_active !== 'undefined' ? payload.is_active : true,
          created_by: payload.created_by || null,
          created_by_name: payload.created_by_name || null,
          created_by_email: payload.created_by_email || null,
        };

        adminUser = await AdminUser.create(adminPayload, { transaction: tx });
      }
    } else {
      // existing admin user — do not change password by default
    }

    // link admin user id to parent payload if available
    if (adminUser && adminUser.id) {
      payload.user_id = adminUser.id;
    }

    const parent = await Parent.create(payload, { transaction: tx });

    if (!externalTx) {
      await tx.commit();
      committed = true;
    }

    // After commit: send email (do not roll back DB on email failures)
    let emailError = null;
    if (sendEmail && email && adminUser) {
      try {
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
          auth: {
            user,
            pass,
          },
        });

        let htmlBody;
        if (plainPassword) {
          htmlBody = `
            <p>Hi ${name},</p>
            <p>Your parent account has been created. You can login with the credentials below:</p>
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
            <p>An account already exists for <strong>${email}</strong>. If you've forgotten your password please use the "Forgot password" flow to reset it.</p>
            <p>-- Admin</p>
          `;
        }

        const info = await transporter.sendMail({
          from,
          to: email,
          subject: 'Parent account created',
          html: htmlBody,
        });

        console.log('createParent: email sent', info.messageId ?? info);
      } catch (err) {
        console.error('createParent: failed to send email', err);
        emailError = err;
      }
    }

    return {
      parent,
      linkedAdminUserId: adminUser ? adminUser.id : null,
      emailError,
    };
  } catch (err) {
    if (!externalTx && !committed) await tx.rollback();
    throw err;
  }
};

const updateParent = async (id, payload, { transaction: externalTx = null } = {}) => {
  const tx = externalTx || await sequelize.transaction();
  try {
    const [updatedCount] = await Parent.update(payload, { where: { id }, transaction: tx });
    if (updatedCount === 0) throw new Error('Parent not found');
    const updated = await Parent.findByPk(id, { transaction: tx });
    if (!externalTx) await tx.commit();
    return updated;
  } catch (err) {
    if (!externalTx) await tx.rollback();
    throw err;
  }
};

const buildWhere = ({ filters = {}, search, startDate, endDate } = {}) => {
  const where = {};

  Object.keys(filters || {}).forEach((key) => {
    const val = filters[key];
    if (val === null || typeof val === 'undefined') return;
    if (Array.isArray(val)) where[key] = { [Op.in]: val };
    else where[key] = val;
  });

  // createdAt date range
  if (startDate || endDate) {
    where.createdAt = {};
    if (startDate) where.createdAt[Op.gte] = new Date(startDate);
    if (endDate) where.createdAt[Op.lte] = new Date(endDate);
  }

  if (search) {
    // attempt to use iLike for postgres, fall back to like
    const ilikeOp = Op.iLike || Op.like;
    const pattern = `%${search}%`;
    where[Op.or] = [
      { name: { [ilikeOp]: pattern } },
      { email: { [ilikeOp]: pattern } },
      { phone: { [ilikeOp]: pattern } },
      { address: { [ilikeOp]: pattern } },
      { created_by_name: { [ilikeOp]: pattern } },
      { created_by_email: { [ilikeOp]: pattern } },
      // childrens_count is numeric — skip pattern; users rarely search by that as free-text
    ];
  }

  return where;
};

const getParents = async (options = {}) => {
  const {
    page = 1,
    limit = 10,
    filters,
    search,
    startDate,
    endDate,
    includeAudit = false,
    includeDeleted = false,
    order = [['createdAt', 'DESC']],
  } = options;

  const where = buildWhere({ filters, search, startDate, endDate });

  const baseAttrs = [
    'id', 'user_id', 'name', 'email', 'phone', 'address',
    'higher_education', 'childrens_count', 'is_active',
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

  const { count, rows } = await Parent.findAndCountAll(findOptions);
  const totalPages = Math.max(1, Math.ceil(count / limit));
  return {
    rows,
    count,
    page: Number(page),
    limit: Number(limit),
    totalPages,
  };
};

const getParentById = async (id, { includeDeleted = false, includeAudit = true } = {}) => {
  const opts = {};
  if (includeDeleted) opts.paranoid = false;
  if (!includeAudit) opts.attributes = { exclude: ['created_by', 'created_by_name', 'created_by_email', 'updated_by', 'updated_by_name', 'updated_by_email', 'deleted_by', 'deleted_by_name', 'deleted_by_email'] };
  const parent = await Parent.findByPk(id, opts);
  if (!parent) throw new Error('Parent not found');
  return parent;
};

const deleteParent = async (id, deletedByMeta = {}, { transaction: externalTx = null } = {}) => {
  const tx = externalTx || await sequelize.transaction();
  try {
    await Parent.update({
      deleted_by: deletedByMeta.deleted_by || null,
      deleted_by_name: deletedByMeta.deleted_by_name || null,
      deleted_by_email: deletedByMeta.deleted_by_email || null,
    }, { where: { id }, transaction: tx });

    const p = await Parent.findByPk(id, { transaction: tx });
    if (!p) throw new Error('Parent not found');
    await p.destroy({ transaction: tx });
    if (!externalTx) await tx.commit();
    return true;
  } catch (err) {
    if (!externalTx) await tx.rollback();
    throw err;
  }
};

const restoreParent = async (id, restoredByMeta = {}, { transaction: externalTx = null } = {}) => {
  const tx = externalTx || await sequelize.transaction();
  try {
    await Parent.restore({ where: { id }, transaction: tx });
    await Parent.update({
      deleted_by: null,
      deleted_by_name: null,
      deleted_by_email: null,
      updated_by: restoredByMeta.updated_by || null,
      updated_by_name: restoredByMeta.updated_by_name || null,
      updated_by_email: restoredByMeta.updated_by_email || null,
    }, { where: { id }, transaction: tx });

    const parent = await Parent.findByPk(id, { transaction: tx });
    if (!externalTx) await tx.commit();
    return parent;
  } catch (err) {
    if (!externalTx) await tx.rollback();
    throw err;
  }
};

export default {
  createParent,
  updateParent,
  getParents,
  getParentById,
  deleteParent,
  restoreParent,
};
