//leave.service.js
import LeaveRequest from "../models/leave.models.js";

const createLeave = async (payload) => {
  return await LeaveRequest.create(payload);
};

const getLeaves = async () => {
  return await LeaveRequest.findAll({
    order: [["createdAt", "DESC"]],
  });
};

const approveLeave = async (id) => {
  const leave = await LeaveRequest.findByPk(id);

  if (!leave) {
    throw new Error("Leave not found");
  }

  await leave.update({
    status: "Approved",
  });

  return leave;
};

const rejectLeave = async (id) => {
  const leave = await LeaveRequest.findByPk(id);

  if (!leave) {
    throw new Error("Leave not found");
  }

  await leave.update({
    status: "Rejected",
  });

  return leave;
};

export default {
  createLeave,
  getLeaves,
  approveLeave,
  rejectLeave,
};