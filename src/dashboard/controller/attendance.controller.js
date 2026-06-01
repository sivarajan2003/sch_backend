//attendance.controller.js
import attendanceService from "../service/attendance.service.js";

const getAttendanceStats = async (req, res) => {
  console.log("Attendance API Hit");

  try {
    const type = req.query.type || "Students";

    const data =
      await attendanceService.getAttendanceStats(type);

    res.status(200).json({
      success: true,
      data,
    });
  } catch (err) {
    res.status(500).json({
      success: false,
      message: err.message,
    });
  }
};
export default {
  getAttendanceStats,
};