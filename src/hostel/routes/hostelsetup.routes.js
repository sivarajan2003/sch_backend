//hostelsetup.routes.js
import express from 'express';
import controller from '../controller/hostelsetup.controller.js';

const router = express.Router();

router.post('/hostelsetup', controller.createHostel);

router.get('/hostelsetup', controller.getHostels);

router.get('/hostelsetup/:id', controller.getHostelById);

router.put('/hostelsetup/:id', controller.updateHostel);

router.delete('/hostelsetup/:id', controller.deleteHostel);

export default router;