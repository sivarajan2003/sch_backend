//homework.service.js
import Homework from "../models/homework.models.js";

const createHomework = async (payload) => {
  return await Homework.create(payload);
};

const getStudentHomework = async (studentId) => {
  return await Homework.findAll({
    where: {
      student_id: studentId,
    },
    order: [["createdAt", "DESC"]],
  });
};

export default {
  createHomework,
  getStudentHomework,
};