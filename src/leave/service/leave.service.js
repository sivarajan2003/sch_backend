//leave.service.js
import Leave from "../models/leave.model.js";

const createLeave = async (data) => {
  return await Leave.create(data);
};

const getLeaves = async () => {
  return await Leave.findAll({
    order: [["createdAt", "DESC"]],
  });
};

const updateLeave = async (
  id,
  body
) => {
  await Leave.update(body, {
    where: { id },
  });

  return await Leave.findByPk(id);
};

const deleteLeave = async (
  id
) => {
  const leave =
    await Leave.findByPk(id);

  if (!leave) {
    return null;
  }

  await leave.destroy();

  return leave;
};

export default {
  createLeave,
  getLeaves,
  updateLeave,
  deleteLeave,
};