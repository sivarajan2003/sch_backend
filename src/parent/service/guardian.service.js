import Guardian from "../models/guardian.models.js";
const createGuardian = async (payload) => {
  return await Guardian.create(payload);
};

const getGuardians = async () => {
  return await Guardian.findAll({
    order: [["createdAt", "DESC"]],
  });
};

const getGuardianById = async (id) => {
  return await Guardian.findByPk(id);
};

const updateGuardian = async (id, payload) => {

  await Guardian.update(payload, {
    where: { id }
  });

  return await Guardian.findByPk(id);
};

const deleteGuardian = async (id) => {

  const guardian = await Guardian.findByPk(id);

  if (!guardian) {
    throw new Error("Guardian not found");
  }

  await guardian.destroy();

  return true;
};

export default {
  createGuardian,
  getGuardians,
  getGuardianById,
  updateGuardian,
  deleteGuardian,
};