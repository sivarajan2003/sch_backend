//dashboard.service.js
import StudentMarks from "../models/studentMarks.models.js";
import LeaveStatus from "../models/leaveStatus.models.js";

const getStudentMarks = async () => {
  return await StudentMarks.findAll();
};

const getLeaveStatus = async () => {
  return await LeaveStatus.findAll();
};

export default {
  getStudentMarks,
  getLeaveStatus,
};