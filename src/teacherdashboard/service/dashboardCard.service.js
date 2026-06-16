//dashboardCard.service.js
import DashboardCard from "../models/dashboardCard.models.js";
import Teacher from "../../teacher/models/teacher.models.js";

const getTeacherDashboardCards = async (
  teacherId
) => {

  const teacher =
    await Teacher.findByPk(teacherId);

  const syllabus =
    await DashboardCard.findOne({
      where: { teacher_id: teacherId },
    });

  return {
    syllabus: syllabus
      ? {
          completed:
            syllabus.completed_percentage,
          pending:
            syllabus.pending_percentage,
        }
      : null,

    bestTeacher: teacher
      ? {
          name: teacher.name,
          subject:
            teacher.subjects?.[0] || "",
          rating:
            syllabus?.rating || 0,
        }
      : null,
  };
};

export default {
  getTeacherDashboardCards,
};