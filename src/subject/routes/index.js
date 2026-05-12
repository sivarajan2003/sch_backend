import express from 'express';
import subjectRouters from './subject.routes.js';
import syllabusRoutes from
'./syllabus.routes.js';

const router = express.Router();

router.use('/subject', subjectRouters);
router.use(
  '/syllabus',
  syllabusRoutes
);


export default router;