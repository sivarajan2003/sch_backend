import Teacher from "../models/teacher.model.js";

const getTeachers = async () => {
  return await Teacher.findAll({
    order: [["createdAt", "DESC"]],
  });
};

export default {
  getTeachers,
};