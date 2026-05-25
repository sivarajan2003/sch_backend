import AttendanceEntry from '../models/attendanceentry.models.js';

const createAttendance = async (
  payload
) => {

  return await AttendanceEntry.create({
    ...payload,

    initial: payload.student
      ?.substring(0, 2)
      .toUpperCase(),

    year: 'Hosteller',

    color: 'blue',
  });
};

const getAttendance = async () => {

  return await AttendanceEntry.findAll({
    order: [['createdAt', 'DESC']],
  });
};

const updateAttendance = async (
  id,
  payload
) => {

  const data =
    await AttendanceEntry.findByPk(id);

  if (!data) {
    throw new Error('Data not found');
  }

  return await data.update(payload);
};

const deleteAttendance = async (
  id
) => {

  const data =
    await AttendanceEntry.findByPk(id);

  if (!data) {
    throw new Error('Data not found');
  }

  return await data.destroy();
};

export default {
  createAttendance,
  getAttendance,
  updateAttendance,
  deleteAttendance,
};