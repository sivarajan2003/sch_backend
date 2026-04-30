//payroll.controller.js
import service from "../service/payroll.service.js";
import dto from "../dto/payroll.dto.js";
const createPayroll = async (req, res) => {
  try {
    const validated = dto.createPayrollSchema.parse(req.body);
    const data = await service.createPayroll(validated);

    res.json({ success: true, data });

  } catch (err) {
    console.log("BACKEND ERROR:", err);

    if (err.errors) {
      return res.status(400).json({
        message: err.errors[0].message,
        errors: err.errors,
      });
    }

    res.status(400).json({
      message: err.message || "Something went wrong",
    });
  }
};

const getPayroll = async (req, res) => {
  try {
    const data = await service.getPayroll();
    res.json({ success: true, data });
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
};

const markPaid = async (req, res) => {
  try {
    const data = await service.markPaid(req.params.id);
    res.json({ success: true, data });
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
};

const deletePayroll = async (req, res) => {
  try {
    await service.deletePayroll(req.params.id);
    res.json({ success: true });
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
};

export default {
  createPayroll,
  getPayroll,
  markPaid,
  deletePayroll,
};