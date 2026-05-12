// timetable.service.js
import { sequelize } from '../../db/index.js';
import { Op } from 'sequelize';
import Timetable from '../models/timetable.models.js';
import Class from '../models/class.models.js';
import Subject from '../../subject/models/subject.models.js';
import Teacher from '../../teacher/models/teacher.models.js';
import Academicyear from '../models/academicyear.models.js';
import ClasssubjectTeacher from '../models/classsubjectteacher.models.js';

/**
 * Create Timetable
 * - Validates duplicate (same day + period + academic year + class)
 * - Validates Class-Subject-Teacher mapping exists
 */

const createTimetable = async (payload, { transaction: externalTx = null } = {}) => {
  
const teacherConflict = await Timetable.findOne({
  where: {
    teacher_id: payload.teacher_id,
    academicyear_id: payload.academicyear_id,
    day_of_week: payload.day_of_week,
    period_number: payload.period_number,
  },
  transaction: tx,
});

if (teacherConflict) {
  throw new Error(
    "Teacher already assigned in another class"
  );
}
  const tx = externalTx || await sequelize.transaction();
  let committed = false;
  const totalPeriods = await Timetable.count({
  where: {
    class_id: payload.class_id,
    academicyear_id: payload.academicyear_id,
    day_of_week: payload.day_of_week,
  },
  transaction: tx,
  
});

if (totalPeriods >= 8) {
  throw new Error(
    "Maximum periods reached for this day"
  );
}
  try {
    // 1️⃣ Check duplicate (same class + same day + same period + academic year)
    const existing = await Timetable.findOne({
      where: {
        class_id: payload.class_id,
        academicyear_id: payload.academicyear_id,
        day_of_week: payload.day_of_week,
        period_number: payload.period_number,
      },
      transaction: tx,
      paranoid: false,
    });
    if (existing) throw new Error("A timetable entry already exists for this class, day, and period.");

    // 2️⃣ Ensure class-subject-teacher mapping exists
    const mapping = await ClasssubjectTeacher.findOne({
      where: {
        class_id: payload.class_id,
        subject_id: payload.subject_id,
        academicyear_id: payload.academicyear_id,
        is_active: true,
      },
      transaction: tx,
    });

    if (!mapping) {
      throw new Error("Invalid mapping: No Class-Subject-Teacher found for given details");
    }

    // attach teacher from mapping
    payload.teacher_id = mapping.teacher_id;

    // 3️⃣ Create timetable
    if (
  payload.period_type === "BREAK" ||
  payload.period_type === "LUNCH"
) {
  payload.teacher_id = null;
  payload.subject_id = null;
}
    const timetable = await Timetable.create(payload, { transaction: tx });

    if (!externalTx) {
      await tx.commit();
      committed = true;
    }
    return timetable;
  } catch (err) {
    if (!externalTx && !committed) await tx.rollback();
    throw err;
  }
};


/**
 * Update Timetable
 */
const updateTimetable = async (id, payload, { transaction: externalTx = null } = {}) => {
  const tx = externalTx || await sequelize.transaction();
  try {
    const timetable = await Timetable.findByPk(id, { transaction: tx });
    if (!timetable) throw new Error("Timetable not found");

    // Prevent duplicates if user is changing day/period/class
    if (payload.day_of_week || payload.period_number || payload.class_id || payload.academicyear_id) {
      const dup = await Timetable.findOne({
        where: {
          id: { [Op.ne]: id },
          class_id: payload.class_id || timetable.class_id,
          academicyear_id: payload.academicyear_id || timetable.academicyear_id,
          day_of_week: payload.day_of_week || timetable.day_of_week,
          period_number: payload.period_number || timetable.period_number,
        },
        transaction: tx,
        paranoid: false,
      });
      if (dup) throw new Error("Duplicate: Another timetable entry already exists for this class/day/period.");
    }

    // Validate mapping if subject/class/year is being updated
    if (payload.subject_id || payload.class_id || payload.academicyear_id) {
      const mapping = await ClasssubjectTeacher.findOne({
        where: {
          class_id: payload.class_id || timetable.class_id,
          subject_id: payload.subject_id || timetable.subject_id,
          academicyear_id: payload.academicyear_id || timetable.academicyear_id,
          is_active: true,
        },
        transaction: tx,
      });
      if (!mapping) throw new Error("Invalid mapping: No Class-Subject-Teacher found");
      payload.teacher_id = mapping.teacher_id;
    }

    await timetable.update(payload, { transaction: tx });
    if (!externalTx) await tx.commit();
    return timetable;
  } catch (err) {
    if (!externalTx) await tx.rollback();
    throw err;
  }
};


/**
 * Delete Timetable (soft delete)
 */
const deleteTimetable = async (id, deletedByMeta = {}, { transaction: externalTx = null } = {}) => {
  const tx = externalTx || await sequelize.transaction();
  try {
    await Timetable.update({
      deleted_by: deletedByMeta.deleted_by || null,
      deleted_by_name: deletedByMeta.deleted_by_name || null,
      deleted_by_email: deletedByMeta.deleted_by_email || null,
    }, { where: { id }, transaction: tx });

    const item = await Timetable.findByPk(id, { transaction: tx });
    if (!item) throw new Error("Timetable not found");

    await item.destroy({ transaction: tx });
    if (!externalTx) await tx.commit();
    return true;
  } catch (err) {
    if (!externalTx) await tx.rollback();
    throw err;
  }
};


/**
 * Restore Timetable
 */
const restoreTimetable = async (id, restoredByMeta = {}, { transaction: externalTx = null } = {}) => {
  const tx = externalTx || await sequelize.transaction();
  try {
    await Timetable.restore({ where: { id }, transaction: tx });
    await Timetable.update({
      deleted_by: null,
      deleted_by_name: null,
      deleted_by_email: null,
      updated_by: restoredByMeta.updated_by || null,
      updated_by_name: restoredByMeta.updated_by_name || null,
      updated_by_email: restoredByMeta.updated_by_email || null,
    }, { where: { id }, transaction: tx });

    const item = await Timetable.findByPk(id, { transaction: tx });
    if (!externalTx) await tx.commit();
    return item;
  } catch (err) {
    if (!externalTx) await tx.rollback();
    throw err;
  }
};


/**
 * Get All Timetables with filters and relations
 */
const getTimetables = async (options = {}) => {
  const {
    page = 1,
    limit = 10,
    class_id,
    subject_id,
    academicyear_id,
    // teacher_id,
    day_of_week,
    period_number,
    includeDeleted = false,
    order = [['createdAt', 'DESC']],
  } = options;

  const where = {};
  if (class_id) where.class_id = class_id;
  if (subject_id) where.subject_id = subject_id;
  if (academicyear_id) where.academicyear_id = academicyear_id;
  // if (teacher_id) where.teacher_id = teacher_id;
  if (day_of_week) where.day_of_week = day_of_week;
  if (period_number) where.period_number = period_number;

  const { count, rows } = await Timetable.findAndCountAll({
    where,
    include: [
      { model: Class, paranoid: !includeDeleted },
      { model: Subject, paranoid: !includeDeleted },
      // { model: Teacher, paranoid: !includeDeleted },
      { model: Academicyear, paranoid: !includeDeleted },
    ],include: [
  { model: Class, as: 'Class', paranoid: !includeDeleted },
  { model: Subject, as: 'Subject', paranoid: !includeDeleted },
  { model: Academicyear, as: 'Academicyear', paranoid: !includeDeleted },
],


    order,
    offset: (page - 1) * limit,
    limit: Number(limit),
    distinct: true,
    paranoid: !includeDeleted,
  });

  return {
    rows,
    count,
    page: Number(page),
    limit: Number(limit),
    totalPages: Math.max(1, Math.ceil(count / limit)),
  };
};


/**
 * Get by ID
 */
const getTimetableById = async (id, { includeDeleted = false } = {}) => {
  const item = await Timetable.findByPk(id, {
    include: [
      { model: Class, paranoid: !includeDeleted },
      { model: Subject, paranoid: !includeDeleted },
      { model: Teacher, paranoid: !includeDeleted },
      { model: Academicyear, paranoid: !includeDeleted },
    ],
    paranoid: !includeDeleted,
  });
  if (!item) throw new Error("Timetable not found");
  return item;
};


export default {
  createTimetable,
  updateTimetable,
  deleteTimetable,
  restoreTimetable,
  getTimetables,
  getTimetableById,
};
