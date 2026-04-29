//hr.roues.js
import express from 'express';
import controller from '../controller/hr.controller.js';

const router = express.Router();

router.post('/', controller.createCandidate);
router.get('/', controller.getCandidates);
//router.post('/select/:id', controller.selectCandidate);
router.patch("/:id/select", controller.selectCandidate);
router.put("/:id", controller.updateCandidate);   // ✅ UPDATE
router.delete("/:id", controller.deleteCandidate); // ✅ DELETE
export default router;