// academicyear.service.js
import { sequelize } from '../../db/index.js';
import { Op } from 'sequelize';
import Academicyear from '../models/academicyear.models.js';
import ClassModel from '../models/class.models.js';
import ClasssubjectTeacher from '../models/classsubjectteacher.models.js';
import Subject from '../../subject/models/subject.models.js';
import Teacher from '../../teacher/models/teacher.models.js';

/**
 * Academicyear service
 *
 * Functions:
 * - createAcademicyear
 * - updateAcademicyear
 * - getAcademicyears (pagination, filters, search, date range)
 * - getAcademicyearById
 * - deleteAcademicyear (soft)
 * - restoreAcademicyear
 *
 * Follows same transaction / audit conventions as other services.
 */

const createAcademicyear = async (payload, { transaction: externalTx = null } = {}) => {
  const tx = externalTx || await sequelize.transaction();
  let committed = false;
  try {
    const ay = await Academicyear.create(payload, { transaction: tx });
    if (!externalTx) {
      await tx.commit();
      committed = true;
    }
    return ay;
  } catch (err) {
    if (!externalTx && !committed) await tx.rollback();
    throw err;
  }
};

const updateAcademicyear = async (id, payload, { transaction: externalTx = null } = {}) => {
  const tx = externalTx || await sequelize.transaction();
  try {
    const [updatedCount] = await Academicyear.update(payload, { where: { id }, transaction: tx });
    if (updatedCount === 0) throw new Error('Academicyear not found');
    const updated = await Academicyear.findByPk(id, { transaction: tx });
    if (!externalTx) await tx.commit();
    return updated;
  } catch (err) {
    if (!externalTx) await tx.rollback();
    throw err;
  }
};

const buildWhere = ({ filters = {}, search, startDate, endDate, is_active } = {}) => {
  const where = {};

  Object.keys(filters || {}).forEach((key) => {
    const val = filters[key];
    if (val === null || typeof val === 'undefined') return;
    if (Array.isArray(val)) where[key] = { [Op.in]: val };
    else where[key] = val;
  });

  if (typeof is_active !== 'undefined') where.is_active = is_active;

  // date range: look at startdate/enddate fields
  if (startDate || endDate) {
    where.startdate = {};
    if (startDate) where.startdate[Op.gte] = new Date(startDate);
    if (endDate) where.startdate[Op.lte] = new Date(endDate);
  }

  if (search) {
    const ilikeOp = Op.iLike || Op.like;
    const pattern = `%${search}%`;
    where[Op.or] = [
      { yearsbyname: { [ilikeOp]: pattern } },
      sequelize.where(sequelize.cast(sequelize.col('startdate'), 'text'), { [ilikeOp]: pattern }),
      sequelize.where(sequelize.cast(sequelize.col('enddate'), 'text'), { [ilikeOp]: pattern }),
      { created_by_name: { [ilikeOp]: pattern } },
      { created_by_email: { [ilikeOp]: pattern } },
    ];
  }

  return where;
};

const getAcademicyears = async (options = {}) => {
  const {
    page = 1,
    limit = 10,
    filters,
    search,
    startDate,
    endDate,
    is_active,
    includeAudit = false,
    includeDeleted = false,
    includeRelations = false, // toggle including related models
    order = [['createdAt', 'DESC']],
  } = options;

  // MySQL requires literal table-qualified ORDER BY when includes are present.
  // sequelize.col() still generates ambiguous SQL in some Sequelize+MySQL versions.
  const resolvedOrder = order.map((o) => {
    if (Array.isArray(o) && o.length === 2 && typeof o[0] === 'string') {
      return [sequelize.literal(`\`Academicyear\`.\`${o[0]}\``), o[1]];
    }
    return o;
  });

  const where = buildWhere({ filters, search, startDate, endDate, is_active });

  const baseAttrs = ['id', 'yearsbyname', 'startdate', 'enddate', 'is_active'];
  const auditAttrs = [
    'created_by', 'created_by_name', 'created_by_email',
    'updated_by', 'updated_by_name', 'updated_by_email',
    'deleted_by', 'deleted_by_name', 'deleted_by_email',
  ];
  const attributes = includeAudit ? baseAttrs.concat(auditAttrs) : baseAttrs;

  const findOptions = {
    where,
    attributes,
    order: resolvedOrder,
    offset: (page - 1) * limit,
    limit: Number(limit),
    distinct: true,
    subQuery: false,
  };

  if (includeDeleted) findOptions.paranoid = false;

  if (includeRelations) {
    // Academicyear -> ClasssubjectTeacher -> (Class, Subject, Teacher)
    findOptions.include = [
      {
        model: ClasssubjectTeacher,
        as: 'ClasssubjectTeachers',
        paranoid: includeDeleted ? false : true,
        attributes: [
          'id', 'class_id', 'subject_id', 'teacher_id', 'academicyear_id', 'is_active',
          'created_by', 'created_by_name', 'created_by_email',
        ],
        include: [
          {
            model: ClassModel,
            as: 'Class',
            paranoid: includeDeleted ? false : true,
            attributes: ['id', 'name', 'section', 'capacity', 'is_active'],
          },
          {
            model: Subject,
            as: 'Subject',
            paranoid: includeDeleted ? false : true,
            attributes: ['id', 'name'],
          },
          {
            model: Teacher,
            as: 'Teacher',
            paranoid: includeDeleted ? false : true,
            attributes: ['id', 'name', 'email'],
          },
        ],
      },
    ];
  }

  const { count, rows } = await Academicyear.findAndCountAll(findOptions);
  const rowsJson = rows.map((r) => (r.toJSON ? r.toJSON() : r));
  const totalPages = Math.max(1, Math.ceil(count / limit));
  return {
    rows: rowsJson,
    count,
    page: Number(page),
    limit: Number(limit),
    totalPages,
  };
};

const getAcademicyearById = async (id, { includeDeleted = false, includeAudit = true, includeRelations = true } = {}) => {
  const opts = {};
  if (includeDeleted) opts.paranoid = false;
  if (!includeAudit) opts.attributes = { exclude: ['created_by', 'created_by_name', 'created_by_email', 'updated_by', 'updated_by_name', 'updated_by_email', 'deleted_by', 'deleted_by_name', 'deleted_by_email'] };

  if (includeRelations) {
    opts.include = [
      {
        model: ClasssubjectTeacher,
        as: 'ClasssubjectTeachers',
        paranoid: includeDeleted ? false : true,
        attributes: [
          'id', 'class_id', 'subject_id', 'teacher_id', 'academicyear_id', 'is_active',
          'created_by', 'created_by_name', 'created_by_email',
        ],
        include: [
          {
            model: ClassModel,
            as: 'Class',
            paranoid: includeDeleted ? false : true,
            attributes: ['id', 'name', 'section', 'capacity', 'is_active'],
          },
          {
            model: Subject,
            as: 'Subject',
            paranoid: includeDeleted ? false : true,
            attributes: ['id', 'name'],
          },
          {
            model: Teacher,
            as: 'Teacher',
            paranoid: includeDeleted ? false : true,
            attributes: ['id', 'name', 'email'],
          },
        ],
      },
    ];
  }

  const ay = await Academicyear.findByPk(id, opts);
  if (!ay) throw new Error('Academicyear not found');

  // if calling code expects a plain object:
  return ay.toJSON ? ay.toJSON() : ay;
};

const deleteAcademicyear = async (id, deletedByMeta = {}, { transaction: externalTx = null } = {}) => {
  const tx = externalTx || await sequelize.transaction();
  try {
    await Academicyear.update({
      deleted_by: deletedByMeta.deleted_by || null,
      deleted_by_name: deletedByMeta.deleted_by_name || null,
      deleted_by_email: deletedByMeta.deleted_by_email || null,
    }, { where: { id }, transaction: tx });

    const item = await Academicyear.findByPk(id, { transaction: tx });
    if (!item) throw new Error('Academicyear not found');
    await item.destroy({ transaction: tx });
    if (!externalTx) await tx.commit();
    return true;
  } catch (err) {
    if (!externalTx) await tx.rollback();
    throw err;
  }
};

const restoreAcademicyear = async (id, restoredByMeta = {}, { transaction: externalTx = null } = {}) => {
  const tx = externalTx || await sequelize.transaction();
  try {
    await Academicyear.restore({ where: { id }, transaction: tx });
    await Academicyear.update({
      deleted_by: null,
      deleted_by_name: null,
      deleted_by_email: null,
      updated_by: restoredByMeta.updated_by || null,
      updated_by_name: restoredByMeta.updated_by_name || null,
      updated_by_email: restoredByMeta.updated_by_email || null,
    }, { where: { id }, transaction: tx });

    const ay = await Academicyear.findByPk(id, { transaction: tx });
    if (!externalTx) await tx.commit();
    return ay;
  } catch (err) {
    if (!externalTx) await tx.rollback();
    throw err;
  }
};

export default {
  createAcademicyear,
  updateAcademicyear,
  getAcademicyears,
  getAcademicyearById,
  deleteAcademicyear,
  restoreAcademicyear,
};
