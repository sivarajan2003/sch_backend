import express from 'express';
import hostelRoutes from './hostelsetup.routes.js';

const router = express.Router();

router.use('/hostel', hostelRoutes);

export default router;