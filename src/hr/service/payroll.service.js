//payroll.service.js
import Payroll from "../models/payroll.model.js";

const createPayroll = async (data) => {
  const netSalary =
    data.basic + (data.allowance || 0) - (data.deduction || 0);

  return await Payroll.create({ ...data, netSalary });
};

const getPayroll = async () => {
  return await Payroll.findAll({
    order: [["createdAt", "DESC"]],
  });
};

const markPaid = async (id) => {
  const record = await Payroll.findByPk(id);
  if (!record) throw new Error("Not found");

  await record.update({ status: "Paid" });
  return record;
};

const deletePayroll = async (id) => {
  const record =  await Payroll.findByPk(id);
  if (!record) throw new Error("Not found");

  await record.destroy();
};

export default {
  createPayroll,
  getPayroll,
  markPaid,
  deletePayroll,
};