//teacherAttendance.service.js
import TeacherAttendance from "../models/teacherAttendance.models.js";

const getTeacherAttendance = async (teacherId) => {

  const attendance =
    await TeacherAttendance.findAll({
      where: {
        teacher_id: teacherId,
      },
      order: [["attendance_date", "DESC"]],
    });

  const present =
    attendance.filter(
      a => a.status === "Present"
    ).length;

  const absent =
    attendance.filter(
      a => a.status === "Absent"
    ).length;

  const late =
    attendance.filter(
      a => a.status === "Late"
    ).length;

  const halfday =
    attendance.filter(
      a => a.status === "Half Day"
    ).length;

  const total =
    attendance.length;

  const percentage =
    total > 0
      ? Math.round((present / total) * 100)
      : 0;

  return {
    total,
    present,
    absent,
    late,
    halfday,
    percentage,
    attendance,
  };
};

export default {
  getTeacherAttendance,
};