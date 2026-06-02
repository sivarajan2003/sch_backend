//leave.controller.js
import leaveService from "../service/leave.service.js";

const createLeave = async (req, res) => {
  try {
    const leave =
      await leaveService.createLeave(req.body);

    res.status(201).json({
      success: true,
      data: leave,
    });
  } catch (err) {
    res.status(500).json({
      success: false,
      message: err.message,
    });
  }
};

const getLeaves = async (req, res) => {
  try {
    const leaves =
      await leaveService.getLeaves();

    res.json({
      success: true,
      data: leaves,
    });
  } catch (err) {
    res.status(500).json({
      success: false,
      message: err.message,
    });
  }
};

const approveLeave = async (req, res) => {
  try {
    const leave =
      await leaveService.approveLeave(
        req.params.id
      );

    res.json({
      success: true,
      data: leave,
    });
  } catch (err) {
    res.status(500).json({
      success: false,
      message: err.message,
    });
  }
};

const rejectLeave = async (req, res) => {
  try {
    const leave =
      await leaveService.rejectLeave(
        req.params.id
      );

    res.json({
      success: true,
      data: leave,
    });
  } catch (err) {
    res.status(500).json({
      success: false,
      message: err.message,
    });
  }
};

export default {
  createLeave,
  getLeaves,
  approveLeave,
  rejectLeave,
};