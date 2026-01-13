// subject.service.js
import { sequelize } from '../../db/index.js';
import { Op } from 'sequelize';
import Subject from '../models/subject.models.js';

const createSubject = async (payload, { transaction: externalTx = null } = {}) => {
  const tx = externalTx || await sequelize.transaction();
  let committed = false;
  try {
    const subject = await Subject.create(payload, { transaction: tx });
    if (!externalTx) {
      await tx.commit();
      committed = true;
    }
    return subject;
  } catch (err) {
    if (!externalTx && !committed) await tx.rollback();
    throw err;
  }
};

const updateSubject = async (id, payload, { transaction: externalTx = null } = {}) => {
  const tx = externalTx || await sequelize.transaction();
  try {
    const [updatedCount] = await Subject.update(payload, { where: { id }, transaction: tx });
    if (updatedCount === 0) throw new Error('Subject not found');
    const updated = await Subject.findByPk(id, { transaction: tx });
    if (!externalTx) await tx.commit();
    return updated;
  } catch (err) {
    if (!externalTx) await tx.rollback();
    throw err;
  }
};

const buildWhere = ({ filters = {}, search, is_active } = {}) => {
  const where = {};

  Object.keys(filters || {}).forEach((key) => {
    const val = filters[key];
    if (val === null || typeof val === 'undefined') return;
    if (Array.isArray(val)) where[key] = { [Op.in]: val };
    else where[key] = val;
  });

  if (typeof is_active !== 'undefined') where.is_active = is_active;

  if (search) {
    const ilikeOp = Op.iLike || Op.like;
    const pattern = `%${search}%`;
    where[Op.or] = [
      { name: { [ilikeOp]: pattern } },
      sequelize.where(sequelize.cast(sequelize.col('id'), 'char'), { [ilikeOp]: pattern }), // allow searching by id as text
    ];
  }

  return where;
};

const getSubjects = async (options = {}) => {
  const {
    page = 1,
    limit = 10,
    filters,
    search,
    is_active,
    includeDeleted = false,
    includeAudit = false,
    order = [['createdAt', 'DESC']],
  } = options;

  const where = buildWhere({ filters, search, is_active });

  const baseAttrs = ['id', 'name', 'is_active'];
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

  const { count, rows } = await Subject.findAndCountAll(findOptions);
  const totalPages = Math.max(1, Math.ceil(count / limit));
  return {
    rows,
    count,
    page: Number(page),
    limit: Number(limit),
    totalPages,
  };
};

const getSubjectById = async (id, { includeDeleted = false, includeAudit = true } = {}) => {
  const opts = {};
  if (includeDeleted) opts.paranoid = false;
  if (!includeAudit) opts.attributes = { exclude: ['created_by', 'created_by_name', 'created_by_email', 'updated_by', 'updated_by_name', 'updated_by_email', 'deleted_by', 'deleted_by_name', 'deleted_by_email'] };
  const subject = await Subject.findByPk(id, opts);
  if (!subject) throw new Error('Subject not found');
  return subject;
};

const deleteSubject = async (id, deletedByMeta = {}, { transaction: externalTx = null } = {}) => {
  const tx = externalTx || await sequelize.transaction();
  try {
    await Subject.update({
      deleted_by: deletedByMeta.deleted_by || null,
      deleted_by_name: deletedByMeta.deleted_by_name || null,
      deleted_by_email: deletedByMeta.deleted_by_email || null,
    }, { where: { id }, transaction: tx });

    const s = await Subject.findByPk(id, { transaction: tx });
    if (!s) throw new Error('Subject not found');
    await s.destroy({ transaction: tx });
    if (!externalTx) await tx.commit();
    return true;
  } catch (err) {
    if (!externalTx) await tx.rollback();
    throw err;
  }
};

const restoreSubject = async (id, restoredByMeta = {}, { transaction: externalTx = null } = {}) => {
  const tx = externalTx || await sequelize.transaction();
  try {
    await Subject.restore({ where: { id }, transaction: tx });
    await Subject.update({
      deleted_by: null,
      deleted_by_name: null,
      deleted_by_email: null,
      updated_by: restoredByMeta.updated_by || null,
      updated_by_name: restoredByMeta.updated_by_name || null,
      updated_by_email: restoredByMeta.updated_by_email || null,
    }, { where: { id }, transaction: tx });

    const subject = await Subject.findByPk(id, { transaction: tx });
    if (!externalTx) await tx.commit();
    return subject;
  } catch (err) {
    if (!externalTx) await tx.rollback();
    throw err;
  }
};

export default {
  createSubject,
  updateSubject,
  getSubjects,
  getSubjectById,
  deleteSubject,
  restoreSubject,
};
