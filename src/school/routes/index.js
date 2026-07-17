//routes/index.js
import express from 'express';
import classRoutes from './class.routes.js';
import academicyearRouters from './academicyear.routes.js';
import academicconfigRouters from './academicconfig.routes.js';
import classsubjectteacherRouters from './classsubjectteacher.routes.js';
import timetableRouters from './timetable.routes.js';
import classroomRouters from './classroom.routes.js';
import settingsRoutes from './settings.routes.js';

const router = express();

router.use('/school', classRoutes);
router.use('/school', academicyearRouters);
router.use('/school', academicconfigRouters);
router.use('/school', classsubjectteacherRouters);
router.use('/school', timetableRouters);
router.use('/school', classroomRouters);
router.use('/school/settings', settingsRoutes);

export default router;
