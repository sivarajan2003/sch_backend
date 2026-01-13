
import express from 'express';
import parentRoute from './parent.routes.js';


const router = express.Router();

router.use('/parent', parentRoute);

export default router;