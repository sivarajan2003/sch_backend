import express from 'express';
import subjectRouters from './subject.routes.js';


const router = express.Router();

router.use('/subject', subjectRouters);

export default router;