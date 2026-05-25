import express from 'express';
import cors from 'cors';
import morgan from 'morgan';
import helmet from 'helmet';
import {responseHelper } from './middleware/index.js';
import adminuserRoutes from './adminuser/routes/index.js';
import teacherRoutes from './teacher/routes/index.js';
import parentRoutes from './parent/routes/index.js';
import hrRoutes from './hr/routes/index.js'; 
import studentRoutes from './student/routes/index.js';
import classRoutes from './school/routes/index.js';
import subjectRoutes from './subject/routes/index.js';
import authRoutes from "./auth/auth.routes.js";
//import payrollRoutes from "./payroll.routes.js";

//import teacherRoutes from "./teacher.routes.js";
import hostelRoutes from './hostel/routes/index.js';

const app = express();

app.use(express.urlencoded({ extended: true })); 
app.use(express.json());
app.use(
  cors({
    origin: [
      "http://localhost:5173",
      "https://sch-fe-1neg.vercel.app",
    ],
    credentials: true,
  })
);


app.use(morgan('dev'));
app.use(helmet());
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
app.use("/api/auth", authRoutes);

app.use('/api/v1/psms', adminuserRoutes);
app.use('/api/v1/psms', teacherRoutes);
app.use('/api/v1/psms', parentRoutes);
app.use('/api/v1/psms', studentRoutes);
app.use('/api/v1/psms', classRoutes);
app.use('/api/v1/psms', subjectRoutes);
app.use('/api/v1/psms', hrRoutes);
app.use('/api/v1/psms/hr-teacher', teacherRoutes);
//app.use('/api/v1/psms', payrollRoutes);
app.use(
  '/api/v1/hostel',
  hostelRoutes
);
app.use(
  '/api/v1/hostel',
  hostelRoutes
);
app.use((req, res) => {
  return res.sendError('Route not found', 404);
});


export default app; 