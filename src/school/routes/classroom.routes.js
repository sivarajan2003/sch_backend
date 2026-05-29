import express from 'express';
import controller from '../controller/classroom.controller.js';
import { verifyToken } from '../../middleware/auth.js';

const router = express.Router();

router.get('/classroom',      verifyToken(['Super Admin', 'Admin']), controller.getClassrooms);
router.post('/classroom',     verifyToken(['Super Admin', 'Admin']), controller.createClassroom);
router.put('/classroom/:id',  verifyToken(['Super Admin', 'Admin']), controller.updateClassroom);
router.delete('/classroom/:id', verifyToken(['Super Admin']),        controller.deleteClassroom);

export default router;
