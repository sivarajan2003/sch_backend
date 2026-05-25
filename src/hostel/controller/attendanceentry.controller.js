import service from '../service/attendanceentry.service.js';

const createAttendance = async (
  req,
  res
) => {

  try {

    const data =
      await service.createAttendance(
        req.body
      );

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

const getAttendance = async (
  req,
  res
) => {

  try {

    const rows =
      await service.getAttendance();

    return res.status(200).json({
      success: true,
      rows,
    });

  } catch (err) {

    return res.status(500).json({
      success: false,
      message: err.message,
    });

  }
};

const updateAttendance = async (
  req,
  res
) => {

  try {

    const data =
      await service.updateAttendance(
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

const deleteAttendance = async (
  req,
  res
) => {

  try {

    await service.deleteAttendance(
      req.params.id
    );

    return res.status(200).json({
      success: true,
      message: 'Deleted',
    });

  } catch (err) {

    return res.status(500).json({
      success: false,
      message: err.message,
    });

  }
};

export default {
  createAttendance,
  getAttendance,
  updateAttendance,
  deleteAttendance,
};