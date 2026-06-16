//studenttodo.controller.js
import service from "../service/studenttodo.service.js";

const getByStudent = async (req, res) => {
  const data = await service.getStudentTodo(
    req.params.studentId
  );

  res.status(200).json({
    success: true,
    data,
  });
};

export default {
  getByStudent,
};