import express from 'express';
import cors from 'cors';
import morgan from 'morgan';
import helmet from 'helmet';
import {responseHelper } from './middleware/index.js';
import dashboardRoutes from './dashboard/routes/index.js';
import adminuserRoutes from './adminuser/routes/index.js';
import teacherRoutes from './teacher/routes/index.js';
import parentRoutes from './parent/routes/index.js';
import hrRoutes from './hr/routes/index.js'; 
import studentRoutes from './student/routes/index.js';
import classRoutes from './school/routes/index.js';
import subjectRoutes from './subject/routes/index.js';
import authRoutes from "./auth/auth.routes.js";
import interviewRoutes from './admission/routes/interview.routes.js';
//import payrollRoutes from "./payroll.routes.js";

//import teacherRoutes from "./teacher.routes.js";
import hostelRoutes from './hostel/routes/index.js';
import attendanceRoutes from './attendance/routes/index.js';
import admissionRoutes from './admission/routes/index.js';
import uploadRoutes from './upload/upload.routes.js';
import managementRoutes from './management/routes/index.js';

import holidayRoutes from "./holiday/routes/index.js";
// import managementRoutes from "./management/routes/index.js";
import leaveRoutes from "./dashboard/routes/leave.routes.js";
import calendarRoutes from "./dashboard/routes/calender.routes.js";
// Register all Sequelize associations (must run before any query)
import './school/models/associations.js';
import upcomingEventRoutes
from "./dashboard/routes/upcomingevent.routes.js";
import performanceRoutes
from "./dashboard/routes/performance.routes.js";
import noticeboardRoutes
from "./dashboard/routes/noticeboard.routes.js";


const app = express();

// CORS must be first so preflight OPTIONS requests are handled for all routes
app.use(
  cors({
    origin: [
      "http://localhost:5173",
      "http://localhost:4000",
      "https://sch-fe-1neg.vercel.app",
    ],
    credentials: true,
  })
);

// Upload route before body parsers so multer can read the raw multipart stream
app.use('/api/v1/upload', uploadRoutes);

app.use(express.urlencoded({ extended: true })); 
app.use(express.json());
app.use(morgan('dev'));
app.use(helmet({ crossOriginResourcePolicy: false }));
app.use(responseHelper);

app.get('/', (req, res) => {
  res.send("Hello World!!").status(404);
}
);

app.get('/api/data', (req, res) => {
  res.sendSuccess({ value: 42 }, 'Data fetched successfully');
});

app.get('/api/error', (req, res) => {
  res.sendError('Something went wrong', 422, [{ field: 'email', message: 'Invalid' }]);
});

//routes
app.use('/api/v1/psms', authRoutes);

app.use('/api/v1/psms', adminuserRoutes);
app.use('/api/v1/psms', teacherRoutes);
app.use('/api/v1/psms', parentRoutes);
app.use('/api/v1/psms', studentRoutes);
app.use('/api/v1/psms', classRoutes);
app.use('/api/v1/psms', subjectRoutes);
app.use('/api/v1/psms', hrRoutes);
app.use('/api/v1/psms/hr-teacher', teacherRoutes);
app.use('/api/v1/psms', attendanceRoutes);
app.use('/api/v1/psms', admissionRoutes);
app.use('/api/v1/psms', interviewRoutes);
app.use('/api/v1/psms', dashboardRoutes);
//app.use('/api/v1/psms', payrollRoutes);
app.use('/api/v1/psms', holidayRoutes);
app.use('/api/v1/psms/hostel', hostelRoutes);

app.use('/api/v1/psms/management', managementRoutes);

app.use("/api/v1/psms", managementRoutes);
app.use("/api/v1/dashboard", leaveRoutes);
app.use("/api/v1/psms", calendarRoutes);
app.use("/api/v1/psms", upcomingEventRoutes);
app.use("/api/v1/psms", performanceRoutes);
app.use("/api/v1/psms", noticeboardRoutes);
app.use((req, res) => {
  return res.sendError('Route not found', 404);
});


export default app; 