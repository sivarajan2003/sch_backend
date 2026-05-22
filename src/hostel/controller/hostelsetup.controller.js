import hostelService from '../service/hostelsetup.service.js';

const createHostel = async (req, res) => {
  try {
    const hostel = await hostelService.createHostel(req.body);

    return res.status(201).json({
      success: true,
      data: hostel,
    });
  } catch (err) {
    return res.status(500).json({
      success: false,
      message: err.message,
    });
  }
};

const getHostels = async (req, res) => {
  try {
    const data = await hostelService.getHostels();

    return res.status(200).json({
      success: true,
      rows: data,
    });
  } catch (err) {
    return res.status(500).json({
      success: false,
      message: err.message,
    });
  }
};

const getHostelById = async (req, res) => {
  try {
    const data = await hostelService.getHostelById(req.params.id);

    return res.status(200).json({
      success: true,
      data,
    });
  } catch (err) {
    return res.status(500).json({
      success: false,
      message: err.message,
    });
  }
};

const updateHostel = async (req, res) => {
  try {
    const data = await hostelService.updateHostel(
      req.params.id,
      req.body
    );

    return res.status(200).json({
      success: true,
      data,
    });
  } catch (err) {
    return res.status(500).json({
      success: false,
      message: err.message,
    });
  }
};

const deleteHostel = async (req, res) => {
  try {
    await hostelService.deleteHostel(req.params.id);

    return res.status(200).json({
      success: true,
      message: 'Deleted Successfully',
    });
  } catch (err) {
    return res.status(500).json({
      success: false,
      message: err.message,
    });
  }
};

export default {
  createHostel,
  getHostels,
  getHostelById,
  updateHostel,
  deleteHostel,
};