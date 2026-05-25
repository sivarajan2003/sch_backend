//roommanagement.routes.js
import express from 'express';

import controller from '../controller/roommanagement.controller.js';

import dto from '../dto/roommanagement.dto.js';

import { validate } from '../../middleware/validate.js';

const router = express.Router();

router.post(
  '/roommanagement',
  validate(dto.createRoomSchema),
  controller.createRoom
);

router.get(
  '/roommanagement',
  controller.getRooms
);

router.get(
  '/roommanagement/:id',
  controller.getRoomById
);

router.put(
  '/roommanagement/:id',
  validate(dto.updateRoomSchema),
  controller.updateRoom
);

router.delete(
  '/roommanagement/:id',
  controller.deleteRoom
);

export default router;