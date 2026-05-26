import attendanceService from '../service/attendance.service.js';

const createAttendance = async (req, res) => {
  try {
    const result = await attendanceService.createAttendance(req.body);
    return res.status(201).json({ success: true, data: result });
  } catch (error) {
    return res.status(500).json({ success: false, message: error.message });
  }
};

const getAttendance = async (req, res) => {
  try {
    const filters = {};
    if (req.query.person_type) filters.person_type = req.query.person_type;
    const result = await attendanceService.getAttendance(filters);
    return res.status(200).json({ success: true, data: result });
  } catch (error) {
    return res.status(500).json({ success: false, message: error.message });
  }
};

/**
 * POST /api/v1/psms/attendance/teacher/save
 * Body: { attendance_date: "YYYY-MM-DD", records: [{ person_id, person_name, attendance_status, notes }] }
 */
const saveTeacherAttendance = async (req, res) => {
  try {
    const { attendance_date, records } = req.body;
    if (!attendance_date || !Array.isArray(records) || records.length === 0) {
      return res.status(400).json({ success: false, message: 'attendance_date and records[] are required' });
    }
    const result = await attendanceService.saveTeacherAttendance({ attendance_date, records });
    return res.status(200).json({ success: true, data: result, message: 'Attendance saved successfully' });
  } catch (error) {
    return res.status(500).json({ success: false, message: error.message });
  }
};

/**
 * GET /api/v1/psms/attendance/teacher?date=YYYY-MM-DD
 * Returns a map of person_id -> { attendance_status, notes } for that date
 */
const getTeacherAttendanceByDate = async (req, res) => {
  try {
    const { date } = req.query;
    if (!date) {
      return res.status(400).json({ success: false, message: 'date query param is required' });
    }
    const data = await attendanceService.getTeacherAttendanceByDate(date);
    return res.status(200).json({ success: true, data });
  } catch (error) {
    return res.status(500).json({ success: false, message: error.message });
  }
};

/**
 * GET /api/v1/psms/attendance/teacher/range?startDate=&endDate=&person_id=
 */
const getTeacherAttendanceRange = async (req, res) => {
  try {
    const { startDate, endDate, person_id } = req.query;
    const data = await attendanceService.getTeacherAttendanceRange({ startDate, endDate, person_id });
    return res.status(200).json({ success: true, data });
  } catch (error) {
    return res.status(500).json({ success: false, message: error.message });
  }
};

export default {
  createAttendance,
  getAttendance,
  saveTeacherAttendance,
  getTeacherAttendanceByDate,
  getTeacherAttendanceRange,
};
