/**
 * Seed Script — Dashboard Dummy Data
 * Seeds: NoticeBoard, StudentActivity, Todo, Attendance (dashboard)
 *
 * Run: node scripts/seed-dashboard.js
 */

import dotenv from 'dotenv';
dotenv.config();

import { sequelize } from '../src/db/index.js';
import NoticeBoard from '../src/dashboard/models/noticeboard.model.js';
import StudentActivity from '../src/dashboard/models/studentactivity.models.js';
import Todo from '../src/dashboard/models/todo.models.js';
import Attendance from '../src/dashboard/models/attendance.models.js';

/* ─────────────────────────────────────────────────────
   NOTICE BOARD
───────────────────────────────────────────────────── */
const NOTICES = [
  {
    title: 'New Syllabus Instructions',
    description: 'Updated syllabus structure has been released for the academic year 2025-26. All teachers are requested to follow the revised curriculum plan.',
    notice_date: '2025-01-11',
    expiry_days: 20,
    notice_type: 'Academic',
  },
  {
    title: 'World Environment Day Program',
    description: 'School-wide programs, competitions and tree plantation activities are planned for June 5th. Student participation is mandatory.',
    notice_date: '2025-05-25',
    expiry_days: 15,
    notice_type: 'Event',
  },
  {
    title: 'Exam Preparation Notification',
    description: 'Students are advised to follow the preparation schedule and attend all revision classes. Extra coaching starts from next week.',
    notice_date: '2025-02-18',
    expiry_days: 12,
    notice_type: 'Exam',
  },
  {
    title: 'Online Classes Preparation',
    description: 'Online class timetable and platform access details will be shared with all students by Friday. Ensure your device is ready.',
    notice_date: '2025-07-10',
    expiry_days: 2,
    notice_type: 'General',
  },
  {
    title: 'Exam Time Table Release',
    description: 'Final examination timetable for Term II has been officially released. Students can download it from the school portal.',
    notice_date: '2025-08-22',
    expiry_days: 6,
    notice_type: 'Exam',
  },
];

/* ─────────────────────────────────────────────────────
   STUDENT ACTIVITIES
───────────────────────────────────────────────────── */
const ACTIVITIES = [
  {
    title: '1st place in "Chess"',
    description: 'Arjun Raj won 1st place in the Inter-School Chess Championship held at Our School.',
    image: 'https://images.unsplash.com/photo-1560019591-3be52a74e458?w=80&h=80&fit=crop',
  },
  {
    title: 'Participated in "Carrom"',
    description: 'Justin Lee participated in the District Carrom Tournament and reached the semi-finals.',
    image: 'https://images.unsplash.com/photo-1529156069898-49953e39b3ac?w=80&h=80&fit=crop',
  },
  {
    title: '1st place in "100M Sprint"',
    description: 'Priya Suresh won gold in the 100M sprint on Annual Sports Day held at Our School.',
    image: 'https://images.unsplash.com/photo-1517649763962-0c623066013b?w=80&h=80&fit=crop',
  },
  {
    title: 'International Science Conference',
    description: 'Rahul Menon represented the school at an International Junior Science Conference held in Germany.',
    image: 'https://images.unsplash.com/photo-1543269865-cbf427effbad?w=80&h=80&fit=crop',
  },
  {
    title: 'Science Exhibition — 2nd Prize',
    description: 'Team of Class 9B won 2nd prize at the State-Level Science Expo with their solar-powered model.',
    image: 'https://images.unsplash.com/photo-1581092160607-ee22731c9c94?w=80&h=80&fit=crop',
  },
];

/* ─────────────────────────────────────────────────────
   TODOS
───────────────────────────────────────────────────── */
const TODOS = [
  { title: 'Send Reminder to Students',        time: '01:00 PM', status: 'Completed' },
  { title: 'Create Routine for New Staff',     time: '04:50 PM', status: 'Inprogress' },
  { title: 'Share Extra Class Info',           time: '04:55 PM', status: 'Yet to Start' },
  { title: 'Fees Notice for Upcoming Term',    time: '04:55 PM', status: 'Yet to Start' },
  { title: 'English — Essay Assignment',       time: '05:10 PM', status: 'Yet to Start' },
];

/* ─────────────────────────────────────────────────────
   ATTENDANCE DASHBOARD
───────────────────────────────────────────────────── */
const TODAY = new Date().toISOString().split('T')[0];

const ATTENDANCE = [
  { attendance_type: 'Students', present: 3580, absent: 44, late: 6, emergency: 28, attendance_date: TODAY },
  { attendance_type: 'Teachers', present: 248,  absent: 6,  late: 2, emergency: 1,  attendance_date: TODAY },
  { attendance_type: 'Staff',    present: 159,  absent: 2,  late: 0, emergency: 0,  attendance_date: TODAY },
];

/* ─────────────────────────────────────────────────────
   MAIN
───────────────────────────────────────────────────── */
async function seed() {
  try {
    await sequelize.authenticate();
    console.log('✅ DB connected\n');

    /* ── Notice Board ── */
    console.log('Seeding Notice Board...');
    for (const n of NOTICES) {
      const [, created] = await NoticeBoard.findOrCreate({
        where: { title: n.title },
        defaults: { ...n, is_active: true },
      });
      console.log(`  ${created ? '+ created' : '~ exists '} Notice: ${n.title}`);
    }

    /* ── Student Activities ── */
    console.log('\nSeeding Student Activities...');
    for (const a of ACTIVITIES) {
      const [, created] = await StudentActivity.findOrCreate({
        where: { title: a.title },
        defaults: { ...a, is_active: true },
      });
      console.log(`  ${created ? '+ created' : '~ exists '} Activity: ${a.title}`);
    }

    /* ── Todos ── */
    console.log('\nSeeding Todos...');
    for (const t of TODOS) {
      const [, created] = await Todo.findOrCreate({
        where: { title: t.title },
        defaults: { ...t, is_active: true },
      });
      console.log(`  ${created ? '+ created' : '~ exists '} Todo: ${t.title}`);
    }

    /* ── Attendance Dashboard ── */
    console.log('\nSeeding Attendance Dashboard...');
    // Create table if it doesn't exist yet
    await Attendance.sync({ alter: false, force: false }).catch(() =>
      Attendance.sync({ force: false })
    );
    for (const att of ATTENDANCE) {
      const [, created] = await Attendance.findOrCreate({
        where: {
          attendance_type: att.attendance_type,
          attendance_date: att.attendance_date,
        },
        defaults: att,
      });
      console.log(`  ${created ? '+ created' : '~ exists '} Attendance: ${att.attendance_type} (${att.attendance_date})`);
    }

    console.log('\n✅ Dashboard seed complete.');
  } catch (err) {
    console.error('❌ Seed failed:', err.message);
    console.error(err);
  } finally {
    await sequelize.close();
  }
}

seed();
