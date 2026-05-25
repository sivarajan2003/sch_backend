import complaintService from '../service/complaintsmaintenance.service.js';

const createComplaint = async (
  req,
  res
) => {
  try {
    const result =
      await complaintService.createComplaint(
        req.body
      );

    return res.status(201).json({
      success: true,
      data: result,
    });
  } catch (error) {
    console.log(error);

    return res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

const getComplaints = async (
  req,
  res
) => {
  try {
    const result =
      await complaintService.getComplaints();

    return res.status(200).json({
      success: true,
      data: result,
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

const getComplaintById = async (
  req,
  res
) => {
  try {
    const result =
      await complaintService.getComplaintById(
        req.params.id
      );

    return res.status(200).json({
      success: true,
      data: result,
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

const updateComplaint = async (
  req,
  res
) => {
  try {
    const result =
      await complaintService.updateComplaint(
        req.params.id,
        req.body
      );

    return res.status(200).json({
      success: true,
      data: result,
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

const deleteComplaint = async (
  req,
  res
) => {
  try {
    await complaintService.deleteComplaint(
      req.params.id
    );

    return res.status(200).json({
      success: true,
      message:
        'Complaint Deleted Successfully',
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

export default {
  createComplaint,
  getComplaints,
  getComplaintById,
  updateComplaint,
  deleteComplaint,
};