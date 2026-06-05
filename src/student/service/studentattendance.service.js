// studentattendance.service.js
import { sequelize } from '../../db/index.js';
import { Op } from 'sequelize';
import StudentAttendance from '../models/studentattendance.models.js';
import Student from '../models/student.models.js';
import Teacher from '../../teacher/models/teacher.models.js';

/**
 * Create Student Attendance
 */
const createAttendance = async (payload, { transaction: externalTx = null } = {}) => {
  const tx = externalTx || await sequelize.transaction();
  let committed = false;
  try {
    // Prevent duplicate for same student & date
    const existing = await StudentAttendance.findOne({
      where: {
        student_id: payload.student_id,
        attendanceDate: payload.attendanceDate,
      },
      transaction: tx,
      paranoid: false,
    });
    if (existing) throw new Error('Attendance already recorded for this student on this date');

    const attendance = await StudentAttendance.create(payload, { transaction: tx });

    if (!externalTx) {
      await tx.commit();
      committed = true;
    }
    return attendance;
  } catch (err) {
    if (!externalTx && !committed) await tx.rollback();
    throw err;
  }
};

/**
 * Bulk Create Student Attendance
 */
const bulkCreateAttendance = async (payloads, { transaction: externalTx = null } = {}) => {
  if (!Array.isArray(payloads) || payloads.length === 0) {
    throw new Error('Payload must be a non-empty array of attendance records');
  }

  const tx = externalTx || await sequelize.transaction();
  let committed = false;

  try {
    // Check duplicates (same student_id + date)
    for (const record of payloads) {
      const exists = await StudentAttendance.findOne({
        where: {
          student_id: record.student_id,
          attendanceDate: record.attendanceDate,
        },
        transaction: tx,
        paranoid: false,
      });
      if (exists) {
        throw new Error(`Attendance already recorded for student ${record.student_id} on ${record.attendanceDate}`);
      }
    }

    // Bulk insert
    const attendances = await StudentAttendance.bulkCreate(payloads, {
      transaction: tx,
      returning: true,
    });

    if (!externalTx) {
      await tx.commit();
      committed = true;
    }

    return attendances;
  } catch (err) {
    if (!externalTx && !committed) await tx.rollback();
    throw err;
  }
};




/**
 * Update Student Attendance
 */
const updateAttendance = async (id, payload, { transaction: externalTx = null } = {}) => {
  const tx = externalTx || await sequelize.transaction();
  try {
    const attendance = await StudentAttendance.findByPk(id, { transaction: tx });
    if (!attendance) throw new Error('Attendance record not found');

    await attendance.update(payload, { transaction: tx });
    if (!externalTx) await tx.commit();
    return attendance;
  } catch (err) {
    if (!externalTx) await tx.rollback();
    throw err;
  }
};

/**
 * Delete Student Attendance (soft delete)
 */
const deleteAttendance = async (id, deletedByMeta = {}, { transaction: externalTx = null } = {}) => {
  const tx = externalTx || await sequelize.transaction();
  try {
    await StudentAttendance.update({
      deleted_by: deletedByMeta.deleted_by || null,
      deleted_by_name: deletedByMeta.deleted_by_name || null,
      deleted_by_email: deletedByMeta.deleted_by_email || null,
    }, { where: { id }, transaction: tx });

    const record = await StudentAttendance.findByPk(id, { transaction: tx });
    if (!record) throw new Error('Attendance record not found');

    await record.destroy({ transaction: tx });
    if (!externalTx) await tx.commit();
    return true;
  } catch (err) {
    if (!externalTx) await tx.rollback();
    throw err;
  }
};

/**
 * Restore Student Attendance
 */
const restoreAttendance = async (id, restoredByMeta = {}, { transaction: externalTx = null } = {}) => {
  const tx = externalTx || await sequelize.transaction();
  try {
    await StudentAttendance.restore({ where: { id }, transaction: tx });
    await StudentAttendance.update({
      deleted_by: null,
      deleted_by_name: null,
      deleted_by_email: null,
      updated_by: restoredByMeta.updated_by || null,
      updated_by_name: restoredByMeta.updated_by_name || null,
      updated_by_email: restoredByMeta.updated_by_email || null,
    }, { where: { id }, transaction: tx });

    const record = await StudentAttendance.findByPk(id, { transaction: tx });
    if (!externalTx) await tx.commit();
    return record;
  } catch (err) {
    if (!externalTx) await tx.rollback();
    throw err;
  }
};

/**
 * Get All Student Attendances with filters and relations
 */
const getAttendances = async (options = {}) => {
  const {
    page = 1,
    limit = 10,
    student_id,
    teacher_id,
    status,
    startDate,
    endDate,
    includeDeleted = false,
    order = [['attendanceDate', 'DESC']],
  } = options;

  const where = {};
  if (student_id) where.student_id = student_id;
  if (teacher_id) where.taken_by = teacher_id;
  if (status) where.status = status;
  if (startDate || endDate) {
    where.attendanceDate = {};
    if (startDate) where.attendanceDate[Op.gte] = startDate;
    if (endDate) where.attendanceDate[Op.lte] = endDate;
  }

  const { count, rows } = await StudentAttendance.findAndCountAll({
    where,
    include: [
      { model: Student, as: 'student', paranoid: !includeDeleted },
      { model: Teacher, as: 'teacher', paranoid: !includeDeleted },
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
const getAttendanceById = async (id, { includeDeleted = false } = {}) => {
  const record = await StudentAttendance.findByPk(id, {
    include: [
      { model: Student, as: 'student', paranoid: !includeDeleted },
      { model: Teacher, as: 'teacher', paranoid: !includeDeleted },
    ],
    paranoid: !includeDeleted,
  });
  if (!record) throw new Error('Attendance record not found');
  return record;
};
const getStudentAttendanceDashboard = async (studentId) => {
  const records = await StudentAttendance.findAll({
    where: {
      student_id: studentId,
    },
    order: [["attendanceDate", "DESC"]],
  });

  const present = records.filter(
    r => r.status === "Present"
  ).length;

  const absent = records.filter(
    r => r.status === "Absent"
  ).length;

  const late = records.filter(
    r => r.status === "Late"
  ).length;

  const halfday = 0;

  const totalWorkingDays = records.length;

  const last7Days = records
    .slice(0, 7)
    .map((r) => ({
      day: new Date(r.attendanceDate)
        .toLocaleDateString("en-US", {
          weekday: "short",
        })
        .charAt(0),
      status: r.status,
    }));

  return {
    totalWorkingDays,
    present,
    absent,
    halfday,
    late,
    attendancePercent:
      totalWorkingDays > 0
        ? Math.round(
            (present / totalWorkingDays) * 100
          )
        : 0,
    last7Days,
    records,
  };
};

export default {
  createAttendance,
  bulkCreateAttendance,
  updateAttendance,
  deleteAttendance,
  restoreAttendance,
  getAttendances,
  getAttendanceById,
  getStudentAttendanceDashboard,
};
