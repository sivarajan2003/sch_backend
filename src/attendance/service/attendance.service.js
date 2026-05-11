import Attendance from '../models/attendance.model.js';

const createAttendance = async (payload) => {
  return await Attendance.create(payload);
};

const getAttendance = async (filters) => {
  return await Attendance.findAll({
    where: filters
  });
};

export default {
  createAttendance,
  getAttendance
};