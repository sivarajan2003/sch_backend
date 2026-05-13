//leave.controller.js
import leaveService from "../service/leave.service.js";
import leaveDto from "../dto/leave.dto.js";

const createLeave = async (
  req,
  res
) => {
  try {
    const validated =
      leaveDto.createLeaveSchema.parse(
        req.body
      );

    const result =
      await leaveService.createLeave(
        validated
      );

    res.status(201).json({
      success: true,
      data: result,
    });

  } catch (error) {
    res.status(400).json({
      success: false,
      message: error.message,
    });
  }
};

const getLeaves = async (
  req,
  res
) => {
  const result =
    await leaveService.getLeaves();

  res.status(200).json({
    success: true,
    data: result,
  });
};

const updateLeave = async (
  req,
  res
) => {
  const result =
    await leaveService.updateLeave(
      req.params.id,
      req.body
    );

  res.status(200).json({
    success: true,
    data: result,
  });
};

const deleteLeave = async (
  req,
  res
) => {
  const result =
    await leaveService.deleteLeave(
      req.params.id
    );

  res.status(200).json({
    success: true,
    data: result,
  });
};

export default {
  createLeave,
  getLeaves,
  updateLeave,
  deleteLeave,
};