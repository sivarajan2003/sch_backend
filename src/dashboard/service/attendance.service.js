//attendance.service.js
import Attendance from "../models/attendance.models.js";

const getAttendanceStats = async (type) => {
  const data = await Attendance.findOne({
    where: {
      attendance_type: type,
    },
    order: [["attendance_date", "DESC"]],
  });

  if (!data) {
    return null;
  }

  return data;
};

export default {
  getAttendanceStats,
};