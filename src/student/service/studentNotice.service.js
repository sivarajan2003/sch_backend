import StudentNotice from "../models/studentNotice.models.js";

const createNotice = async (payload) => {
  return await StudentNotice.create(payload);
};

const getStudentNotices = async (studentId) => {
  return await StudentNotice.findAll({
    where: {
      student_id: studentId,
    },
    order: [["createdAt", "DESC"]],
  });
};

export default {
  createNotice,
  getStudentNotices,
};