import guardianService from "../service/guardian.service.js";

const createGuardian = async (req, res) => {
  try {

    const data = await guardianService.createGuardian(req.body);

    return res.status(201).json({
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

const getGuardians = async (req, res) => {
  try {

    const data = await guardianService.getGuardians();

    return res.json({
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

const updateGuardian = async (req, res) => {
  try {

    const data = await guardianService.updateGuardian(
      req.params.id,
      req.body
    );

    return res.json({
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

const deleteGuardian = async (req, res) => {
  try {

    await guardianService.deleteGuardian(req.params.id);

    return res.json({
      success: true,
      message: "Deleted successfully",
    });

  } catch (err) {

    return res.status(500).json({
      success: false,
      message: err.message,
    });

  }
};

export default {
  createGuardian,
  getGuardians,
  updateGuardian,
  deleteGuardian,
};