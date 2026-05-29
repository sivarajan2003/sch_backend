/**
 * Seed Script — adds 5 dummy records each for:
 * Parents, Teachers, Students (linked to parents), Guardians
 *
 * Run: node seed.js
 */

import dotenv from 'dotenv';
dotenv.config();

import { sequelize } from './src/db/index.js';
import Parent  from './src/parent/models/parent.models.js';
import Teacher from './src/teacher/models/teacher.models.js';
import Student from './src/student/models/student.models.js';
import Guardian from './src/parent/models/guardian.models.js';

/* ─── helpers ─────────────────────────────────────── */
const pad = (n) => String(n).padStart(2, '0');
const dob = (y, m, d) => `${y}-${pad(m)}-${pad(d)}`;

/* ─── data ─────────────────────────────────────────── */

const PARENTS = [
  { name: 'Ravi Kumar',    email: 'ravi.kumar@seed.com',    phone: '9876543210', address: '12 MG Road, Chennai',       occupation: 'Engineer',    higher_education: 'B.Tech' },
  { name: 'Shabana Begum', email: 'shabana.b@seed.com',     phone: '9876543211', address: '45 Anna Nagar, Chennai',    occupation: 'Teacher',     higher_education: 'M.A' },
  { name: 'John Mathew',   email: 'john.mathew@seed.com',   phone: '9876543212', address: '7 Velachery, Chennai',      occupation: 'Doctor',      higher_education: 'MBBS' },
  { name: 'Priya Nair',    email: 'priya.nair@seed.com',    phone: '9876543213', address: '3 T Nagar, Chennai',        occupation: 'Accountant',  higher_education: 'B.Com' },
  { name: 'Suresh Babu',   email: 'suresh.babu@seed.com',   phone: '9876543214', address: '88 Adyar, Chennai',         occupation: 'Businessman', higher_education: 'MBA' },
];

const TEACHERS = [
  { name: 'Erickson James',  email: 'erickson@seed.com',  number: '9800000001', address: '10 Nungambakkam, Chennai', date_of_birth: dob(1985, 3, 15), gender: 'Male',   qualification: 'M.Sc Mathematics',  desgination: 'Head Master',        salary: 55000 },
  { name: 'Mori Tanaka',     email: 'mori@seed.com',      number: '9800000002', address: '22 Kilpauk, Chennai',      date_of_birth: dob(1990, 7, 20), gender: 'Female', qualification: 'B.Ed Physics',       desgination: 'Teacher',            salary: 40000 },
  { name: 'Joseph Antony',   email: 'joseph@seed.com',    number: '9800000003', address: '5 Mylapore, Chennai',      date_of_birth: dob(1988, 11, 5), gender: 'Male',   qualification: 'M.A English',        desgination: 'Assistant Teacher',  salary: 38000 },
  { name: 'Teresa Fernandez',email: 'teresa@seed.com',    number: '9800000004', address: '14 Besant Nagar, Chennai', date_of_birth: dob(1992, 1, 28), gender: 'Female', qualification: 'B.Sc Chemistry',     desgination: 'Teacher',            salary: 42000 },
  { name: 'Ramesh Iyer',     email: 'ramesh@seed.com',    number: '9800000005', address: '9 Tambaram, Chennai',      date_of_birth: dob(1983, 6, 10), gender: 'Male',   qualification: 'M.Com',              desgination: 'Teacher',            salary: 39000 },
];

const GUARDIANS = [
  { guardian_id: 'GRD001', name: 'Avila Thomas',   email: 'avila@seed.com',   phone: '9700000001', child_name: 'Gifford Thomas' },
  { guardian_id: 'GRD002', name: 'Claudia Pereira',email: 'claudia@seed.com', phone: '9700000002', child_name: 'Richard Pereira' },
  { guardian_id: 'GRD003', name: 'Jessie Mathew',  email: 'jessie@seed.com',  phone: '9700000003', child_name: 'Kathleen Mathew' },
  { guardian_id: 'GRD004', name: 'Edwin Raj',      email: 'edwin@seed.com',   phone: '9700000004', child_name: 'Susan Raj' },
  { guardian_id: 'GRD005', name: 'Mary Joseph',    email: 'mary@seed.com',    phone: '9700000005', child_name: 'Ryan Joseph' },
];

/* Students are built after parents are inserted so we can link parent_id */
const buildStudents = (parents) => [
  { name: 'Ananya Sharma',    age: 12, gender: 'Female', address: '12 MG Road, Chennai',       date_of_birth: dob(2012, 4, 10), yearofjoining: 2020, roll_number: 101, blood_group: 'A+',  admission_number: 'ADM-SEED-001', admission_date: '2020-06-01', academic_year: '2024-2025', parent_id: parents[0].id },
  { name: 'Mohammed Arif',    age: 10, gender: 'Male',   address: '45 Anna Nagar, Chennai',    date_of_birth: dob(2014, 8, 19), yearofjoining: 2021, roll_number: 102, blood_group: 'B+',  admission_number: 'ADM-SEED-002', admission_date: '2021-06-01', academic_year: '2024-2025', parent_id: parents[1].id },
  { name: 'Kavya Mathew',     age: 9,  gender: 'Female', address: '7 Velachery, Chennai',      date_of_birth: dob(2015, 12, 5), yearofjoining: 2022, roll_number: 103, blood_group: 'O+',  admission_number: 'ADM-SEED-003', admission_date: '2022-06-01', academic_year: '2024-2025', parent_id: parents[2].id },
  { name: 'Joseph Nair',      age: 8,  gender: 'Male',   address: '3 T Nagar, Chennai',        date_of_birth: dob(2016, 3, 22), yearofjoining: 2022, roll_number: 104, blood_group: 'AB+', admission_number: 'ADM-SEED-004', admission_date: '2022-06-01', academic_year: '2024-2025', parent_id: parents[3].id },
  { name: 'Ayesha Babu',      age: 11, gender: 'Female', address: '88 Adyar, Chennai',         date_of_birth: dob(2013, 5, 13), yearofjoining: 2020, roll_number: 105, blood_group: 'B-',  admission_number: 'ADM-SEED-005', admission_date: '2020-06-01', academic_year: '2024-2025', parent_id: parents[4].id },
];

/* ─── main ─────────────────────────────────────────── */

async function seed() {
  try {
    await sequelize.authenticate();
    console.log('✅ DB connected\n');

    /* ── Parents ── */
    console.log('Seeding parents...');
    const parents = [];
    for (const p of PARENTS) {
      const [record, created] = await Parent.findOrCreate({
        where: { email: p.email },
        defaults: { ...p, is_active: true },
      });
      parents.push(record);
      console.log(`  ${created ? '+ created' : '~ exists '} Parent: ${record.name}`);
    }

    /* ── Teachers ── */
    console.log('\nSeeding teachers...');
    for (const t of TEACHERS) {
      const [record, created] = await Teacher.findOrCreate({
        where: { email: t.email },
        defaults: { ...t, is_active: true },
      });
      console.log(`  ${created ? '+ created' : '~ exists '} Teacher: ${record.name}`);
    }

    /* ── Students ── */
    console.log('\nSeeding students...');
    for (const s of buildStudents(parents)) {
      const [record, created] = await Student.findOrCreate({
        where: { admission_number: s.admission_number },
        defaults: { ...s, is_active: true },
      });
      console.log(`  ${created ? '+ created' : '~ exists '} Student: ${record.name}`);
    }

    /* ── Guardians ── */
    console.log('\nSeeding guardians...');
    for (const g of GUARDIANS) {
      const [record, created] = await Guardian.findOrCreate({
        where: { guardian_id: g.guardian_id },
        defaults: { ...g, is_active: true },
      });
      console.log(`  ${created ? '+ created' : '~ exists '} Guardian: ${record.name}`);
    }

    console.log('\n✅ Seed complete.');
  } catch (err) {
    console.error('❌ Seed failed:', err.message);
  } finally {
    await sequelize.close();
  }
}

seed();
