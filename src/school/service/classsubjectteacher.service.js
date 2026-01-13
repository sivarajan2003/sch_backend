// classsubjectteacher.service.js
import { sequelize } from '../../db/index.js';
import { Op } from 'sequelize';
import ClasssubjectTeacher from '../models/classsubjectteacher.models.js';
import ClassModel from '../models/class.models.js';
import Subject from '../../subject/models/subject.models.js';
import Teacher from '../../teacher/models/teacher.models.js';
import Academicyear from '../models/academicyear.models.js';

const createClassSubjectTeacher = async (payload, { transaction: externalTx = null } = {}) => {
  const tx = externalTx || await sequelize.transaction();
  let committed = false;
  try {
    // prevent duplicate for same class + subject + academicyear
    const existing = await ClasssubjectTeacher.findOne({
      where: {
        class_id: payload.class_id,
        subject_id: payload.subject_id,
        academicyear_id: payload.academicyear_id,
      },
      transaction: tx,
      paranoid: false,
    });

    if (existing) {
      throw new Error('A mapping for this class, subject and academic year already exists');
    }

    const item = await ClasssubjectTeacher.create(payload, { transaction: tx });

    if (!externalTx) {
      await tx.commit();
      committed = true;
    }

    return item;
  } catch (err) {
    if (!externalTx && !committed) await tx.rollback();
    throw err;
  }
};

const updateClassSubjectTeacher = async (id, payload, { transaction: externalTx = null } = {}) => {
  const tx = externalTx || await sequelize.transaction();
  try {
    // if class/subject/academicyear are changing ensure no duplicate
    if (payload.class_id || payload.subject_id || payload.academicyear_id) {
      const existing = await ClasssubjectTeacher.findOne({
        where: {
          id: { [Op.ne]: id },
          class_id: payload.class_id || undefined,
          subject_id: payload.subject_id || undefined,
          academicyear_id: payload.academicyear_id || undefined,
        },
        transaction: tx,
        paranoid: false,
      });

      if (existing) throw new Error('Another mapping with the same class/subject/academic year already exists');
    }

    const [count] = await ClasssubjectTeacher.update(payload, { where: { id }, transaction: tx });
    if (count === 0) throw new Error('ClasssubjectTeacher not found');
    const updated = await ClasssubjectTeacher.findByPk(id, { transaction: tx });
    if (!externalTx) await tx.commit();
    return updated;
  } catch (err) {
    if (!externalTx) await tx.rollback();
    throw err;
  }
};

const buildWhere = ({ filters = {}, search, class_id, subject_id, teacher_id, academicyear_id, is_active } = {}) => {
  const where = {};

  Object.keys(filters || {}).forEach((key) => {
    const val = filters[key];
    if (val === null || typeof val === 'undefined') return;
    if (Array.isArray(val)) where[key] = { [Op.in]: val };
    else where[key] = val;
  });

  if (typeof is_active !== 'undefined') where.is_active = is_active;
  if (class_id) where.class_id = class_id;
  if (subject_id) where.subject_id = subject_id;
  if (teacher_id) where.teacher_id = teacher_id;
  if (academicyear_id) where.academicyear_id = academicyear_id;

  if (search) {
    const ilikeOp = Op.iLike || Op.like;
    const pattern = `%${search}%`;
    where[Op.or] = [
      sequelize.where(sequelize.cast(sequelize.col('created_by_name'), 'text'), { [ilikeOp]: pattern }),
      sequelize.where(sequelize.cast(sequelize.col('created_by_email'), 'text'), { [ilikeOp]: pattern }),
    ];
  }

  return where;
};

const getClassSubjectTeachers = async (options = {}) => {
  const {
    page = 1,
    limit = 20,
    filters,
    search,
    class_id,
    subject_id,
    teacher_id,
    academicyear_id,
    is_active,
    includeDeleted = false,
    includeRelations = true,
    order = [['createdAt', 'DESC']],
  } = options;

  const where = buildWhere({ filters, search, class_id, subject_id, teacher_id, academicyear_id, is_active });

  const { count, rows } = await ClasssubjectTeacher.findAndCountAll({
    where,
    order,
    offset: (page - 1) * limit,
    limit: Number(limit),
    paranoid: !includeDeleted,
  });

  let results = rows.map(r => r.toJSON ? r.toJSON() : r);

  if (includeRelations && results.length > 0) {
    // Collect distinct IDs for batch queries
    const classIds = [...new Set(results.map(r => r.class_id).filter(Boolean))];
    const subjectIds = [...new Set(results.map(r => r.subject_id).filter(Boolean))];
    const teacherIds = [...new Set(results.map(r => r.teacher_id).filter(Boolean))];
    const ayIds = [...new Set(results.map(r => r.academicyear_id).filter(Boolean))];

    // Parallel fetch
    const [classes, subjects, teachers, ays] = await Promise.all([
      classIds.length ? ClassModel.findAll({ where: { id: classIds }, attributes: ['id', 'name', 'section'] }) : [],
      subjectIds.length ? Subject.findAll({ where: { id: subjectIds }, attributes: ['id', 'name'] }) : [],
      teacherIds.length ? Teacher.findAll({ where: { id: teacherIds }, attributes: ['id', 'name', 'email'] }) : [],
      ayIds.length ? Academicyear.findAll({ where: { id: ayIds }, attributes: ['id', 'yearsbyname', 'startdate', 'enddate'] }) : [],
    ]);

    // Convert to lookup maps
    const classById = Object.fromEntries(classes.map(c => [c.id, c.toJSON()]));
    const subjectById = Object.fromEntries(subjects.map(s => [s.id, s.toJSON()]));
    const teacherById = Object.fromEntries(teachers.map(t => [t.id, t.toJSON()]));
    const ayById = Object.fromEntries(ays.map(a => [a.id, a.toJSON()]));

    // Attach relations
    results = results.map(r => ({
      ...r,
      class: classById[r.class_id] || null,
      subject: subjectById[r.subject_id] || null,
      teacher: teacherById[r.teacher_id] || null,
      academicYear: ayById[r.academicyear_id] || null,
    }));
  }

  return {
    rows: results,
    count,
    page: Number(page),
    limit: Number(limit),
    totalPages: Math.max(1, Math.ceil(count / limit)),
  };
};


const getClassSubjectTeacherById = async (id, { includeDeleted = false, includeRelations = true } = {}) => {
  const item = await ClasssubjectTeacher.findByPk(id, { paranoid: !includeDeleted });
  if (!item) throw new Error('ClasssubjectTeacher not found');

  const plain = item.toJSON ? item.toJSON() : item;

  if (includeRelations) {
    const [klass, subject, teacher, ay] = await Promise.all([
      plain.class_id ? ClassModel.findByPk(plain.class_id, { paranoid: !includeDeleted }) : null,
      plain.subject_id ? Subject.findByPk(plain.subject_id, { paranoid: !includeDeleted }) : null,
      plain.teacher_id ? Teacher.findByPk(plain.teacher_id, { paranoid: !includeDeleted }) : null,
      plain.academicyear_id ? Academicyear.findByPk(plain.academicyear_id, { paranoid: !includeDeleted }) : null,
    ]);

    plain.class = klass ? klass.toJSON() : null;
    plain.subject = subject ? subject.toJSON() : null;
    plain.teacher = teacher ? teacher.toJSON() : null;
    plain.academicYear = ay ? ay.toJSON() : null;
  }

  return plain;
};


const deleteClassSubjectTeacher = async (id, deletedByMeta = {}, { transaction: externalTx = null } = {}) => {
  const tx = externalTx || await sequelize.transaction();
  try {
    await ClasssubjectTeacher.update({
      deleted_by: deletedByMeta.deleted_by || null,
      deleted_by_name: deletedByMeta.deleted_by_name || null,
      deleted_by_email: deletedByMeta.deleted_by_email || null,
    }, { where: { id }, transaction: tx });

    const item = await ClasssubjectTeacher.findByPk(id, { transaction: tx });
    if (!item) throw new Error('ClasssubjectTeacher not found');
    await item.destroy({ transaction: tx });
    if (!externalTx) await tx.commit();
    return true;
  } catch (err) {
    if (!externalTx) await tx.rollback();
    throw err;
  }
};

const restoreClassSubjectTeacher = async (id, restoredByMeta = {}, { transaction: externalTx = null } = {}) => {
  const tx = externalTx || await sequelize.transaction();
  try {
    await ClasssubjectTeacher.restore({ where: { id }, transaction: tx });
    await ClasssubjectTeacher.update({
      deleted_by: null,
      deleted_by_name: null,
      deleted_by_email: null,
      updated_by: restoredByMeta.updated_by || null,
      updated_by_name: restoredByMeta.updated_by_name || null,
      updated_by_email: restoredByMeta.updated_by_email || null,
    }, { where: { id }, transaction: tx });

    const item = await ClasssubjectTeacher.findByPk(id, { transaction: tx });
    if (!externalTx) await tx.commit();
    return item;
  } catch (err) {
    if (!externalTx) await tx.rollback();
    throw err;
  }
};

export default {
  createClassSubjectTeacher,
  updateClassSubjectTeacher,
  getClassSubjectTeachers,
  getClassSubjectTeacherById,
  deleteClassSubjectTeacher,
  restoreClassSubjectTeacher,
};
