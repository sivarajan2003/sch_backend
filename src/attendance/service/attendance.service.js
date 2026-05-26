import { Op } from 'sequelize';
import { sequelize } from '../../db/index.js';
import Attendance from '../models/attendance.model.js';

const createAttendance = async (payload) => {
  return await Attendance.create(payload);
};

const getAttendance = async (filters) => {
  return await Attendance.findAll({ where: filters });
};

/**
 * Bulk upsert teacher attendance for a given date.
 * payload: { attendance_date, records: [{ person_id, person_name, attendance_status, notes }] }
 */
const saveTeacherAttendance = async ({ attendance_date, records }) => {
  const tx = await sequelize.transaction();
  try {
    const results = [];
    for (const rec of records) {
      const [row, created] = await Attendance.upsert(
        {
          person_id: rec.person_id,
          person_name: rec.person_name,
          person_type: 'Teacher',
          attendance_status: rec.attendance_status,
          attendance_date,
          notes: rec.notes || null,
        },
        { transaction: tx, returning: true }
      );
      results.push(row);
    }
    await tx.commit();
    return results;
  } catch (err) {
    await tx.rollback();
    throw err;
  }
};

/**
 * Get teacher attendance for a specific date.
 * Returns a map: { [person_id]: { attendance_status, notes } }
 */
const getTeacherAttendanceByDate = async (attendance_date) => {
  const rows = await Attendance.findAll({
    where: { person_type: 'Teacher', attendance_date },
    attributes: ['person_id', 'attendance_status', 'notes'],
  });
  const map = {};
  rows.forEach((r) => {
    map[r.person_id] = { attendance_status: r.attendance_status, notes: r.notes };
  });
  return map;
};

/**
 * Get teacher attendance summary for a date range.
 */
const getTeacherAttendanceRange = async ({ startDate, endDate, person_id } = {}) => {
  const where = { person_type: 'Teacher' };
  if (startDate && endDate) {
    where.attendance_date = { [Op.between]: [startDate, endDate] };
  } else if (startDate) {
    where.attendance_date = { [Op.gte]: startDate };
  } else if (endDate) {
    where.attendance_date = { [Op.lte]: endDate };
  }
  if (person_id) where.person_id = person_id;

  return await Attendance.findAll({
    where,
    order: [['attendance_date', 'DESC']],
  });
};

export default {
  createAttendance,
  getAttendance,
  saveTeacherAttendance,
  getTeacherAttendanceByDate,
  getTeacherAttendanceRange,
};
