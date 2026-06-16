//teacherAttendance.controller.js
import attendanceService
from "../service/teacherAttendance.service.js";

const getTeacherAttendance =
async (req, res) => {

  try {

    const teacherId =
      req.params.teacherId;

    const data =
      await attendanceService.getTeacherAttendance(
        teacherId
      );

    res.status(200).json({
      success: true,
      data,
    });

  } catch (error) {

    res.status(500).json({
      success: false,
      message: error.message,
    });

  }

};

export default {
  getTeacherAttendance,
};