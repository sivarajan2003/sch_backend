import express from 'express';
import hrRoutes from './hr.routes.js';

const router = express.Router();

router.use('/hr', hrRoutes);

export default router;