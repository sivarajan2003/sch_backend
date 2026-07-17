//studentexam.service.js
import StudentExam from "../models/studentexam.models.js";
import { Op } from "sequelize";

const createExam = async (payload) => {
  return await StudentExam.create(payload);
};

const getAllExams = async ({ search, page = 1, limit = 50 } = {}) => {
  const where = {};
  if (search) {
    where[Op.or] = [
      { subject: { [Op.like]: `%${search}%` } },
      { room_no: { [Op.like]: `%${search}%` } },
    ];
  }
  return await StudentExam.findAll({
    where,
    order: [["exam_date", "ASC"]],
    limit: Number(limit),
    offset: (Number(page) - 1) * Number(limit),
  });
};

const getStudentExams = async (studentId) => {
  return await StudentExam.findAll({
    where: { student_id: studentId },
    order: [["exam_date", "ASC"]],
  });
};

const getExamById = async (id) => {
  return await StudentExam.findByPk(id);
};

const updateExam = async (id, payload) => {
  const [count] = await StudentExam.update(payload, { where: { id } });
  if (!count) throw new Error("Exam not found");
  return await StudentExam.findByPk(id);
};

const deleteExam = async (id) => {
  const count = await StudentExam.destroy({ where: { id } });
  if (!count) throw new Error("Exam not found");
  return true;
};

export default {
  createExam,
  getAllExams,
  getStudentExams,
  getExamById,
  updateExam,
  deleteExam,
};