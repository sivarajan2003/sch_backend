// class.service.js
import { sequelize } from '../../db/index.js';
import { Op } from 'sequelize';
import Class from '../models/class.models.js';
import Student from '../../student/models/student.models.js';

/**
 * Class service
 *
 * Provides:
 * - createClass
 * - updateClass
 * - getClasses (filters, pagination, optional includeStudents)
 * - getClassById (optional includeStudents)
 * - deleteClass (soft)
 * - restoreClass
 *
 * Notes:
 * - Transactions follow the pattern used in other services.
 * - includeStudents is implemented as a post-query lookup (no association required on the models).
 */

const createClass = async (payload, { transaction: externalTx = null } = {}) => {
  const tx = externalTx || await sequelize.transaction();
  let committed = false;
  try {
    const klass = await Class.create(payload, { transaction: tx });
    if (!externalTx) {
      await tx.commit();
      committed = true;
    }
    return klass;
  } catch (err) {
    if (!externalTx && !committed) await tx.rollback();
    throw err;
  }
};

const updateClass = async (id, payload, { transaction: externalTx = null } = {}) => {
  const tx = externalTx || await sequelize.transaction();
  try {
    const [updatedCount] = await Class.update(payload, { where: { id }, transaction: tx });
    if (updatedCount === 0) throw new Error('Class not found');
    const updated = await Class.findByPk(id, { transaction: tx });
    if (!externalTx) await tx.commit();
    return updated;
  } catch (err) {
    if (!externalTx) await tx.rollback();
    throw err;
  }
};

const buildWhere = ({ filters = {}, search, grade, section, is_active } = {}) => {
  const where = {};

  Object.keys(filters || {}).forEach((key) => {
    const val = filters[key];
    if (val === null || typeof val === 'undefined') return;
    if (Array.isArray(val)) where[key] = { [Op.in]: val };
    else where[key] = val;
  });

  if (typeof is_active !== 'undefined') where.is_active = is_active;

  if (grade) {
    // allow numeric or string
    const g = Number(grade);
    if (!Number.isNaN(g)) where.grade = g;
    else where.grade = grade;
  }

  if (section) where.section = section;

  if (search) {
    const ilikeOp = Op.iLike || Op.like;
    const pattern = `%${search}%`;
    where[Op.or] = [
      { name: { [ilikeOp]: pattern } },
      { section: { [ilikeOp]: pattern } },
      sequelize.where(sequelize.cast(sequelize.col('grade'), 'text'), { [ilikeOp]: pattern }),
    ];
  }

  return where;
};

const getClasses = async (options = {}) => {
  const {
    page = 1,
    limit = 10,
    filters,
    search,
    // grade,
    section,
    is_active,
    includeDeleted = false,
    includeAudit = false,
    includeStudents = false,
    order = [['createdAt', 'DESC']],
  } = options;

  const where = buildWhere({ filters, search,  section, is_active });

  const baseAttrs = ['id', 'name', 'section',  'capacity', 'is_active'];
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

  const { count, rows } = await Class.findAndCountAll(findOptions);

  // If caller asked for students, fetch students for the returned classes and attach them.
  let rowsWithStudents = rows;
  if (includeStudents && rows && rows.length > 0) {
    const classIds = rows.map((r) => r.id);
    const students = await Student.findAll({
      where: { class_id: { [Op.in]: classIds } },
      attributes: ['id', 'name', 'roll_number', 'class_id', 'profile_image', 'admission_number', 'academic_year', 'is_active'],
      paranoid: false, // include soft-deleted students? keep default false to match other behavior
    });
    // group by class_id
    const byClass = students.reduce((acc, s) => {
      const cid = s.class_id || 'null';
      if (!acc[cid]) acc[cid] = [];
      acc[cid].push(s);
      return acc;
    }, {});
    // attach
    rowsWithStudents = rows.map((r) => {
      const plain = r.toJSON ? r.toJSON() : r;
      plain.students = byClass[plain.id] || [];
      return plain;
    });
  } else {
    // normalize rows to JSON (so controller output is consistent)
    rowsWithStudents = rows.map((r) => (r.toJSON ? r.toJSON() : r));
  }

  const totalPages = Math.max(1, Math.ceil(count / limit));
  return {
    rows: rowsWithStudents,
    count,
    page: Number(page),
    limit: Number(limit),
    totalPages,
  };
};

const getClassById = async (id, { includeDeleted = false, includeAudit = true, includeStudents = false } = {}) => {
  const opts = {};
  if (includeDeleted) opts.paranoid = false;
  if (!includeAudit) opts.attributes = { exclude: ['created_by', 'created_by_name', 'created_by_email', 'updated_by', 'updated_by_name', 'updated_by_email', 'deleted_by', 'deleted_by_name', 'deleted_by_email'] };

  const klass = await Class.findByPk(id, opts);
  if (!klass) throw new Error('Class not found');
  const result = klass.toJSON ? klass.toJSON() : klass;

  if (includeStudents) {
    const students = await Student.findAll({
      where: { class_id: id },
      attributes: ['id', 'name', 'roll_number', 'profile_image', 'admission_number', 'academic_year', 'is_active'],
      paranoid: false,
    });
    result.students = students;
  }

  return result;
};

const deleteClass = async (id, deletedByMeta = {}, { transaction: externalTx = null } = {}) => {
  const tx = externalTx || await sequelize.transaction();
  try {
    await Class.update({
      deleted_by: deletedByMeta.deleted_by || null,
      deleted_by_name: deletedByMeta.deleted_by_name || null,
      deleted_by_email: deletedByMeta.deleted_by_email || null,
    }, { where: { id }, transaction: tx });

    const c = await Class.findByPk(id, { transaction: tx });
    if (!c) throw new Error('Class not found');
    await c.destroy({ transaction: tx });
    if (!externalTx) await tx.commit();
    return true;
  } catch (err) {
    if (!externalTx) await tx.rollback();
    throw err;
  }
};

const restoreClass = async (id, restoredByMeta = {}, { transaction: externalTx = null } = {}) => {
  const tx = externalTx || await sequelize.transaction();
  try {
    await Class.restore({ where: { id }, transaction: tx });
    await Class.update({
      deleted_by: null,
      deleted_by_name: null,
      deleted_by_email: null,
      updated_by: restoredByMeta.updated_by || null,
      updated_by_name: restoredByMeta.updated_by_name || null,
      updated_by_email: restoredByMeta.updated_by_email || null,
    }, { where: { id }, transaction: tx });

    const klass = await Class.findByPk(id, { transaction: tx });
    if (!externalTx) await tx.commit();
    return klass;
  } catch (err) {
    if (!externalTx) await tx.rollback();
    throw err;
  }
};

export default {
  createClass,
  updateClass,
  getClasses,
  getClassById,
  deleteClass,
  restoreClass,
};
