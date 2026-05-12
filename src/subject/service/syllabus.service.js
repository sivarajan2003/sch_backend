import Syllabus from "../models/syllabus.models.js";

const createSyllabus = async (
  payload
) => {
  return await Syllabus.create(payload);
};

const getSyllabus = async () => {
  return await Syllabus.findAll();
};

const deleteSyllabus = async (
  id
) => {

  const item =
    await Syllabus.findByPk(id);

  await item.destroy();

  return true;
};

export default {
  createSyllabus,
  getSyllabus,
  deleteSyllabus
};