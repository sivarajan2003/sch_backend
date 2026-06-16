//syllabus.service.js
import Syllabus from "../models/syllabus.models.js";

const getTeacherSyllabus = async (teacherId) => {
  return await Syllabus.findAll({
    where: {
      teacher_id: teacherId,
    },
    order: [["createdAt", "DESC"]],
  });
};

export default {
  getTeacherSyllabus,
};