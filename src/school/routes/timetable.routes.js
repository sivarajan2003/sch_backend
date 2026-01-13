// timetable.routes.js
import express from 'express';
import controller from '../controller/timetable.controller.js';
import { verifyToken } from '../../middleware/auth.js';
import { validate } from '../../middleware/validate.js';
import dto from '../dto/timetable.dto.js';

const router = express.Router();

router.post(
  '/timetable',
  verifyToken(['Super Admin', 'Admin']),
  validate(dto.createTimetableSchema),
  controller.createTimetable
);

router.get(
  '/timetable',
  verifyToken(['Super Admin', 'Admin']),
  validate(dto.filterTimetableSchema, 'query'),
  controller.getTimetables
);

router.get(
  '/timetable/:id',
  verifyToken(['Super Admin', 'Admin']),
  controller.getTimetableById
);

router.put(
  '/timetable/:id',
  verifyToken(['Super Admin', 'Admin']),
  validate(dto.updateTimetableSchema),
  controller.updateTimetable
);

router.patch(
  '/timetable/:id',
  verifyToken(['Super Admin', 'Admin']),
  validate(dto.updateTimetableSchema),
  controller.patchTimetable
);

router.delete(
  '/timetable/:id',
  verifyToken(['Super Admin']),
  controller.deleteTimetable
);

router.patch(
  '/timetable/:id/restore',
  verifyToken(['Super Admin']),
  controller.restoreTimetable
);

export default router;
