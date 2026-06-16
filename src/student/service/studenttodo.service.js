//studenttodo.service.js
import StudentTodo from "../models/studenttodo.models.js";

const getStudentTodo = async (studentId) => {
  return await StudentTodo.findAll({
    where: {
      student_id: studentId,
    },
  });
};

export default {
  getStudentTodo,
};