import service from "../service/teacher.service.js";

const getTeachers = async (req, res) => {
  const data = await service.getTeachers();

  return res.sendSuccess(data);
};

export default {
  getTeachers,
};