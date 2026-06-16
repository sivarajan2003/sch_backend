//teacherdashboard.service.js
import TeacherTimetable from "../models/teacherdashboard.models.js";

const getTodayClasses = async (teacherId) => {

  const today = new Date()
    .toLocaleDateString("en-US", {
      weekday: "long",
    });

  const data = await TeacherTimetable.findAll({
    where: {
      teacher_id: teacherId,
      day_name: today,
    },
    order: [["start_time", "ASC"]],
  });

  return data;
};

export default {
  getTodayClasses,
};