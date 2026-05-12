
import express from 'express';
import parentRoute from './parent.routes.js';
import guardianRoute from "./guardian.routes.js";



const router = express.Router();

router.use('/parent', parentRoute);
router.use("/guardian", guardianRoute);
export default router;