import express from 'express';
import controller from '../controller/hr.controller.js';

const router = express.Router();

router.post('/', controller.createCandidate);
router.get('/', controller.getCandidates);
//router.post('/select/:id', controller.selectCandidate);
router.patch("/:id/select", controller.selectCandidate);
export default router;