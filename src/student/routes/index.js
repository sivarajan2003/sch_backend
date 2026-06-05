import express from 'express';
import studentRoutes from './student.routes.js';
import studentattendanceRoutes from './studentattendance.routes.js';
import studentexamRoutes from "./studentexam.routes.js";
import studentPerformanceRoutes from "./studentperformance.routes.js";
import homeworkRoutes from "./homework.routes.js";
import studentExamResultRoutes from "./studentexamresult.routes.js";
import studentFeesRoutes from "./studentfees.routes.js";
import studentFacultyRoutes
from "./studentFaculty.routes.js";
import studentNoticeRoutes
from "./studentNotice.routes.js";

const router = express.Router();

router.use('/student', studentRoutes);
router.use('/studentattendance', studentattendanceRoutes);
router.use('/studentexam', studentexamRoutes);
router.use("/student-performance",studentPerformanceRoutes);
router.use("/homework", homeworkRoutes);
router.use("/studentexamresult", studentExamResultRoutes); 
router.use(
  "/studentfees",
  studentFeesRoutes
);
router.use(
  "/student",
  studentFacultyRoutes
);
router.use(
  "/student-notices",
  studentNoticeRoutes
);
export default router;