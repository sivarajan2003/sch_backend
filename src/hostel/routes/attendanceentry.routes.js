import express from 'express';

import controller from '../controller/attendanceentry.controller.js';

const router = express.Router();

router.post(
  '/attendanceentry',
  controller.createAttendance
);

router.get(
  '/attendanceentry',
  controller.getAttendance
);

router.put(
  '/attendanceentry/:id',
  controller.updateAttendance
);

router.delete(
  '/attendanceentry/:id',
  controller.deleteAttendance
);

export default router;