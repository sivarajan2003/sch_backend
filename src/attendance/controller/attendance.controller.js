import attendanceService from '../service/attendance.service.js';

const createAttendance = async (req, res) => {
  try {

    const result =
      await attendanceService.createAttendance(req.body);

    return res.status(201).json({
      success: true,
      data: result
    });

  } catch(error) {
    return res.status(500).json({
      success: false,
      message: error.message
    });
  }
};

const getAttendance = async (req, res) => {
  try {

    const filters = {};

    if(req.query.person_type){
      filters.person_type = req.query.person_type;
    }

    const result =
      await attendanceService.getAttendance(filters);

    return res.status(200).json({
      success: true,
      data: result
    });

  } catch(error){
    return res.status(500).json({
      success:false,
      message:error.message
    });
  }
};

export default {
  createAttendance,
  getAttendance
};