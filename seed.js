/**
 * ╔══════════════════════════════════════════════════════════════════╗
 * ║   SMS Final — Complete API-Based Seed Script                    ║
 * ║   100% REST API calls — no direct DB / Sequelize imports        ║
 * ║   Run: node seed.js  (backend must be running on port 4000)     ║
 * ╚══════════════════════════════════════════════════════════════════╝
 */

import axios from 'axios';

const BASE  = 'http://localhost:4000/api/v1/psms';
const SECRET = 'seed-bootstrap-2024';
let TOKEN = '';

// ─── helpers ──────────────────────────────────────────────────────────────────
const api  = axios.create({ baseURL: BASE, validateStatus: () => true });
const auth = () => ({ headers: { Authorization: `Bearer ${TOKEN}` } });
function pad(n) { return String(n).padStart(2, '0'); }
function dob(y, m, d) { return `${y}-${pad(m)}-${pad(d)}`; }

async function post(path, body, label) {
  const r = await api.post(path, body, auth());
  if (r.status >= 200 && r.status < 300) {
    const id = r.data?.data?.id || r.data?.id || '';
    console.log(`  ✅ ${label}${id ? ' — ' + id.slice(0,8) : ''}`);
    return r.data?.data ?? r.data;
  }
  const raw = typeof r.data === 'string' ? r.data : JSON.stringify(r.data);
  const msg = raw.toLowerCase();
  if (r.status === 409 || msg.includes('already') || msg.includes('duplicate') || msg.includes('unique') || msg.includes('validation error') || (r.status === 500 && msg.includes('<!doctype'))) {
    console.log(`  ⏭  ${label} — already exists`);
    return null;
  }
  console.log(`  ❌ ${label} — ${r.status}: ${raw.slice(0,150)}`);
  return null;
}

async function getAll(path) {
  const r = await api.get(path, { ...auth(), params: { limit: 500 } });
  const d = r.data?.data ?? r.data?.rows ?? r.data;
  return Array.isArray(d) ? d : [];
}

async function login(email, password) {
  for (const path of ['/adminuser/login', '/login']) {
    const r = await api.post(path, { email, password });
    if (r.status === 200) {
      const t = r.data?.accessToken || r.data?.token || r.data?.data?.accessToken;
      if (t) return t;
    }
  }
  throw new Error(`Login failed for ${email}`);
}

// ═══════════════════════════════════════════════════════════════════════
// DATA
// ═══════════════════════════════════════════════════════════════════════

const ALL_ADMIN_USERS = [
  { username: 'Super Admin',    email: 'superadmin@atelier.com', password: 'Admin@123',   role: 'Super Admin', phone: '9000000001' },
  { username: 'School Admin',   email: 'admin@atelier.com',      password: 'Admin@123',   role: 'Admin',       phone: '9000000002' },
  { username: 'Erickson James', email: 'teacher1@atelier.com',   password: 'Teacher@123', role: 'Teacher',     phone: '9000000003' },
  { username: 'Mori Tanaka',    email: 'teacher2@atelier.com',   password: 'Teacher@123', role: 'Teacher',     phone: '9000000004' },
  { username: 'Joseph Antony',  email: 'teacher3@atelier.com',   password: 'Teacher@123', role: 'Teacher',     phone: '9000000005' },
  { username: 'Teresa F',       email: 'teacher4@atelier.com',   password: 'Teacher@123', role: 'Teacher',     phone: '9000000006' },
  { username: 'Ramesh Iyer',    email: 'teacher5@atelier.com',   password: 'Teacher@123', role: 'Teacher',     phone: '9000000007' },
  { username: 'Ravi Kumar',     email: 'parent1@atelier.com',    password: 'Parent@123',  role: 'Parent',      phone: '9000000008' },
  { username: 'Shabana Begum',  email: 'parent2@atelier.com',    password: 'Parent@123',  role: 'Parent',      phone: '9000000009' },
  { username: 'John Mathew',    email: 'parent3@atelier.com',    password: 'Parent@123',  role: 'Parent',      phone: '9000000010' },
  { username: 'Priya Nair',     email: 'parent4@atelier.com',    password: 'Parent@123',  role: 'Parent',      phone: '9000000011' },
  { username: 'Suresh Babu',    email: 'parent5@atelier.com',    password: 'Parent@123',  role: 'Parent',      phone: '9000000012' },
];

const CLASSES = [
  { name: 'Grade 1', section: 'A', capacity: 35 }, { name: 'Grade 1', section: 'B', capacity: 35 },
  { name: 'Grade 2', section: 'A', capacity: 35 }, { name: 'Grade 3', section: 'A', capacity: 35 },
  { name: 'Grade 4', section: 'A', capacity: 35 }, { name: 'Grade 5', section: 'A', capacity: 40 },
  { name: 'Grade 6', section: 'A', capacity: 40 }, { name: 'Grade 7', section: 'A', capacity: 40 },
  { name: 'Grade 8', section: 'A', capacity: 40 }, { name: 'Grade 9', section: 'A', capacity: 45 },
];

const SUBJECTS = [
  { name: 'Mathematics',        code: 'MATH01', type: 'Theory'    },
  { name: 'English',            code: 'ENG01',  type: 'Theory'    },
  { name: 'Science',            code: 'SCI01',  type: 'Theory'    },
  { name: 'Social Science',     code: 'SS01',   type: 'Theory'    },
  { name: 'Physics',            code: 'PHY01',  type: 'Theory'    },
  { name: 'Chemistry',          code: 'CHEM01', type: 'Theory'    },
  { name: 'Biology',            code: 'BIO01',  type: 'Theory'    },
  { name: 'Computer Science',   code: 'CS01',   type: 'Practical' },
  { name: 'Physical Education', code: 'PE01',   type: 'Practical' },
  { name: 'Tamil',              code: 'TAM01',  type: 'Theory'    },
];

const CLASSROOMS = [
  { room_no: 'A-101', capacity: 40 }, { room_no: 'A-102', capacity: 40 },
  { room_no: 'A-103', capacity: 35 }, { room_no: 'B-201', capacity: 35 },
  { room_no: 'B-202', capacity: 35 }, { room_no: 'B-203', capacity: 35 },
  { room_no: 'C-301', capacity: 50 }, { room_no: 'LAB-1', capacity: 30 },
  { room_no: 'LAB-2', capacity: 30 }, { room_no: 'HALL-1', capacity: 200 },
];

const TEACHERS_DATA = [
  { name:'Erickson James',   email:'teacher1@atelier.com', number:'9800000001', address:'10 Nungambakkam, Chennai', date_of_birth:dob(1985,3,15), gender:'Male',   qualification:'M.Sc Mathematics', desgination:'Head Master',       salary:55000 },
  { name:'Mori Tanaka',      email:'teacher2@atelier.com', number:'9800000002', address:'22 Kilpauk, Chennai',      date_of_birth:dob(1990,7,20), gender:'Female', qualification:'B.Ed Physics',      desgination:'Teacher',           salary:40000 },
  { name:'Joseph Antony',    email:'teacher3@atelier.com', number:'9800000003', address:'5 Mylapore, Chennai',      date_of_birth:dob(1988,11,5), gender:'Male',   qualification:'M.A English',       desgination:'Assistant Teacher', salary:38000 },
  { name:'Teresa Fernandez', email:'teacher4@atelier.com', number:'9800000004', address:'14 Besant Nagar, Chennai', date_of_birth:dob(1992,1,28), gender:'Female', qualification:'B.Sc Chemistry',    desgination:'Teacher',           salary:42000 },
  { name:'Ramesh Iyer',      email:'teacher5@atelier.com', number:'9800000005', address:'9 Tambaram, Chennai',      date_of_birth:dob(1983,6,10), gender:'Male',   qualification:'M.Com',             desgination:'Teacher',           salary:39000 },
];

const PARENTS_DATA = [
  { name:'Ravi Kumar',    email:'parent1@atelier.com', phone:'9876543210', address:'12 MG Road, Chennai',    occupation:'Engineer',    higher_education:'B.Tech', childrens_count:1 },
  { name:'Shabana Begum', email:'parent2@atelier.com', phone:'9876543211', address:'45 Anna Nagar, Chennai', occupation:'Teacher',     higher_education:'M.A',    childrens_count:2 },
  { name:'John Mathew',   email:'parent3@atelier.com', phone:'9876543212', address:'7 Velachery, Chennai',   occupation:'Doctor',      higher_education:'MBBS',   childrens_count:1 },
  { name:'Priya Nair',    email:'parent4@atelier.com', phone:'9876543213', address:'3 T Nagar, Chennai',     occupation:'Accountant',  higher_education:'B.Com',  childrens_count:1 },
  { name:'Suresh Babu',   email:'parent5@atelier.com', phone:'9876543214', address:'88 Adyar, Chennai',      occupation:'Businessman', higher_education:'MBA',    childrens_count:1 },
];

const GUARDIANS_DATA = [
  { guardian_id:'GRD001', name:'Avila Thomas',    email:'avila@atelier.com',   phone:'9700000001', child_name:'Gifford Thomas'  },
  { guardian_id:'GRD002', name:'Claudia Pereira', email:'claudia@atelier.com', phone:'9700000002', child_name:'Richard Pereira' },
  { guardian_id:'GRD003', name:'Jessie Mathew',   email:'jessie@atelier.com',  phone:'9700000003', child_name:'Kathleen Mathew' },
  { guardian_id:'GRD004', name:'Edwin Raj',        email:'edwin@atelier.com',   phone:'9700000004', child_name:'Susan Raj'       },
  { guardian_id:'GRD005', name:'Mary Joseph',      email:'mary@atelier.com',    phone:'9700000005', child_name:'Ryan Joseph'     },
];

const HOLIDAYS_DATA = [
  { title:'Pongal',           from_date:'2025-01-14', to_date:'2025-01-14', description:'Harvest festival'       },
  { title:'Republic Day',     from_date:'2025-01-26', to_date:'2025-01-26', description:'National holiday'       },
  { title:'Holi',             from_date:'2025-03-17', to_date:'2025-03-17', description:'Festival of colors'     },
  { title:'Good Friday',      from_date:'2025-04-18', to_date:'2025-04-18', description:'Christian holiday'      },
  { title:'May Day',          from_date:'2025-05-01', to_date:'2025-05-01', description:'Labour Day'             },
  { title:'Summer Vacation',  from_date:'2025-05-05', to_date:'2025-05-25', description:'School summer break'    },
  { title:'Independence Day', from_date:'2025-08-15', to_date:'2025-08-15', description:'National holiday'       },
  { title:'Gandhi Jayanti',   from_date:'2025-10-02', to_date:'2025-10-02', description:'National holiday'       },
  { title:'Diwali',           from_date:'2025-10-20', to_date:'2025-10-22', description:'Festival of lights'     },
  { title:'Christmas',        from_date:'2025-12-25', to_date:'2025-12-25', description:'Christmas holiday'      },
];

const LEAVES_DATA = [
  { employee_name:'Erickson James',   employee_role:'Teacher', leave_type:'Medical',   leave_from:'2025-02-10', leave_to:'2025-02-12', applied_on:'2025-02-08', status:'Approved' },
  { employee_name:'Mori Tanaka',      employee_role:'Teacher', leave_type:'Casual',    leave_from:'2025-03-05', leave_to:'2025-03-06', applied_on:'2025-03-03', status:'Approved' },
  { employee_name:'Joseph Antony',    employee_role:'Teacher', leave_type:'Medical',   leave_from:'2025-04-01', leave_to:'2025-04-03', applied_on:'2025-03-29', status:'Pending'  },
  { employee_name:'Teresa Fernandez', employee_role:'Teacher', leave_type:'Emergency', leave_from:'2025-05-01', leave_to:'2025-05-31', applied_on:'2025-04-25', status:'Approved' },
  { employee_name:'Ramesh Iyer',      employee_role:'Teacher', leave_type:'Personal',  leave_from:'2025-06-14', leave_to:'2025-06-14', applied_on:'2025-06-12', status:'Rejected' },
];

const HR_DATA = [
  { name:'Arun Prakash',  email:'arun.hr@atelier.com',   phone:'9100000001', qualification:'B.Ed Science',   status:'Interview', salary_pending:0 },
  { name:'Kavitha Selvi', email:'kavitha.hr@atelier.com',phone:'9100000002', qualification:'M.A Tamil',      status:'Selected',  salary_pending:0 },
  { name:'Daniel Raj',    email:'daniel.hr@atelier.com', phone:'9100000003', qualification:'B.P.Ed',         status:'Interview', salary_pending:0 },
  { name:'Sunita Pandey', email:'sunita.hr@atelier.com', phone:'9100000004', qualification:'MBA HR',         status:'Rejected',  salary_pending:0 },
  { name:'Vikram Singh',  email:'vikram.hr@atelier.com', phone:'9100000005', qualification:'B.Sc Computers', status:'Interview', salary_pending:0 },
];

const PAYROLL_DATA = [
  { name:'Erickson James',   basic:55000, allowance:5000, deduction:2000, netSalary:58000, month:'June 2025',  status:'Paid'    },
  { name:'Mori Tanaka',      basic:40000, allowance:4000, deduction:1500, netSalary:42500, month:'June 2025',  status:'Paid'    },
  { name:'Joseph Antony',    basic:38000, allowance:3000, deduction:1200, netSalary:39800, month:'June 2025',  status:'Paid'    },
  { name:'Teresa Fernandez', basic:42000, allowance:4000, deduction:1800, netSalary:44200, month:'June 2025',  status:'Paid'    },
  { name:'Ramesh Iyer',      basic:39000, allowance:3500, deduction:1400, netSalary:41100, month:'June 2025',  status:'Paid'    },
  { name:'Erickson James',   basic:55000, allowance:5000, deduction:2000, netSalary:58000, month:'July 2025',  status:'Pending' },
  { name:'Mori Tanaka',      basic:40000, allowance:4000, deduction:1500, netSalary:42500, month:'July 2025',  status:'Pending' },
];

const FEES_DATA = [
  { id:'FG001', group:'Tuition Fees',     description:'Monthly tuition fee',          status:'Active'   },
  { id:'FG002', group:'Transport Fees',   description:'Monthly school bus fee',       status:'Active'   },
  { id:'FG003', group:'Lab Fees',         description:'Annual laboratory usage fee',  status:'Active'   },
  { id:'FG004', group:'Sports Fees',      description:'Annual sports fee',            status:'Active'   },
  { id:'FG005', group:'Library Fees',     description:'Annual library membership',    status:'Active'   },
  { id:'FG006', group:'Exam Fees',        description:'Term-end examination fee',     status:'Active'   },
  { id:'FG007', group:'Hostel Fees',      description:'Monthly hostel fee',           status:'Active'   },
  { id:'FG008', group:'Development Fees', description:'One-time development fund',    status:'Inactive' },
];

const LIBRARY_DATA = [
  { id:'LMB001', name:'Ananya Sharma',  cardNo:'LIB-101', email:'ananya@student.com',  mobile:'+91 98765 43210' },
  { id:'LMB002', name:'Mohammed Arif',  cardNo:'LIB-102', email:'arif@student.com',    mobile:'+91 98765 43211' },
  { id:'LMB003', name:'Kavya Mathew',   cardNo:'LIB-103', email:'kavya@student.com',   mobile:'+91 98765 43212' },
  { id:'LMB004', name:'Erickson James', cardNo:'LIB-201', email:'teacher1@atelier.com',mobile:'+91 98000 00001' },
  { id:'LMB005', name:'Ravi Kumar',     cardNo:'LIB-301', email:'parent1@atelier.com', mobile:'+91 98765 43213' },
];

const SPORTS_DATA = [
  { name:'Cricket',    coach:'Thomas George', year:2018 },
  { name:'Football',   coach:'Nicholas Paul', year:2019 },
  { name:'Basketball', coach:'Jon David',     year:2020 },
  { name:'Volleyball', coach:'Adams Samuel',  year:2020 },
  { name:'Badminton',  coach:'Shannon Kumar', year:2021 },
  { name:'Chess',      coach:'Sonia Mary',    year:2021 },
  { name:'Tennis',     coach:'Sandra Rao',    year:2022 },
  { name:'Carrom',     coach:'Wilson Joseph', year:2022 },
];

const BUSES_DATA = [
  { id:'BUS001', busNumber:'Bus-01', plateNumber:'TN01AB1234', capacity:50, driverName:'Murugan K',  driverPhone:'9500000001', status:'Active'   },
  { id:'BUS002', busNumber:'Bus-02', plateNumber:'TN01CD5678', capacity:45, driverName:'Selvam R',   driverPhone:'9500000002', status:'Active'   },
  { id:'BUS003', busNumber:'Bus-03', plateNumber:'TN01EF9012', capacity:40, driverName:'Kannan P',   driverPhone:'9500000003', status:'Active'   },
  { id:'BUS004', busNumber:'Bus-04', plateNumber:'TN01GH3456', capacity:50, driverName:'Rajan T',    driverPhone:'9500000004', status:'Inactive' },
];

const ROUTES_DATA = [
  { id:'RT001', name:'Route A — North', busId:'BUS001', stops:JSON.stringify(['Perambur','Kolathur','Anna Nagar']),       shift:'Morning', status:'Active' },
  { id:'RT002', name:'Route B — South', busId:'BUS002', stops:JSON.stringify(['Tambaram','Pallavaram','Guindy']),          shift:'Morning', status:'Active' },
  { id:'RT003', name:'Route C — West',  busId:'BUS003', stops:JSON.stringify(['Porur','Valasaravakkam','Vadapalani']),     shift:'Morning', status:'Active' },
];

const HOSTELS_DATA = [
  { hostel_id:'HST001', name:'Boys Hostel A',  type:'Boys',  rooms:40, capacity:160, warden:'Mr. Kumar',  status:'Active'   },
  { hostel_id:'HST002', name:'Girls Hostel B', type:'Girls', rooms:35, capacity:140, warden:'Mrs. Priya', status:'Active'   },
  { hostel_id:'HST003', name:'Staff Quarters', type:'Staff', rooms:20, capacity:60,  warden:'Mr. Raj',    status:'Active'   },
  { hostel_id:'HST004', name:'Boys Hostel C',  type:'Boys',  rooms:30, capacity:120, warden:'Mr. Suresh', status:'Inactive' },
];

// Rooms — DTO requires: roomNo, hostel, floor, capacity, occupied, type, status (no room_id)
const ROOMS_DATA = [
  { roomNo:'A-101', hostel:'Boys Hostel A',  floor:'Ground', capacity:4, occupied:3, type:'AC Room', status:'Available' },
  { roomNo:'A-102', hostel:'Boys Hostel A',  floor:'Ground', capacity:4, occupied:4, type:'AC Room', status:'Full'      },
  { roomNo:'A-201', hostel:'Boys Hostel A',  floor:'1st',    capacity:6, occupied:2, type:'Non AC',  status:'Available' },
  { roomNo:'B-101', hostel:'Girls Hostel B', floor:'Ground', capacity:4, occupied:4, type:'AC Room', status:'Full'      },
  { roomNo:'B-102', hostel:'Girls Hostel B', floor:'Ground', capacity:4, occupied:1, type:'AC Room', status:'Available' },
  { roomNo:'S-101', hostel:'Staff Quarters', floor:'Ground', capacity:1, occupied:1, type:'Suite',   status:'Full'      },
  { roomNo:'S-102', hostel:'Staff Quarters', floor:'Ground', capacity:1, occupied:0, type:'Suite',   status:'Available' },
];

// Complaints — DTO requires: student, hostel, room, issue, priority, date (no complaint_id)
const COMPLAINTS_DATA = [
  { student:'Ananya Sharma', regNo:'ATL-2024-001', hostel:'Girls Hostel B', room:'B-101', issue:'Water leakage in bathroom',     priority:'High',   status:'In Progress', date:'2024-09-10' },
  { student:'Mohammed Arif', regNo:'ATL-2024-002', hostel:'Boys Hostel A',  room:'A-101', issue:'Broken window latch',           priority:'Medium', status:'Pending',     date:'2024-09-15' },
  { student:'Rohit Ravi',    regNo:'ATL-2024-006', hostel:'Boys Hostel A',  room:'A-101', issue:'Fan not working',               priority:'Low',    status:'Resolved',    date:'2024-09-01' },
  { student:'Arjun Iyer',    regNo:'ATL-2024-008', hostel:'Boys Hostel A',  room:'A-101', issue:'Electrical socket not working', priority:'High',   status:'Pending',     date:'2024-09-20' },
];

const HOSTEL_FEES_DATA = [
  { fee_id:'HF001', student:'Ananya Sharma', regNo:'ATL-2024-001', hostel:'Girls Hostel B', room:'B-101', total:15000, paid:15000, balance:0,    dueDate:'2024-07-31', status:'Paid',    year:'2024-2025' },
  { fee_id:'HF002', student:'Mohammed Arif', regNo:'ATL-2024-002', hostel:'Boys Hostel A',  room:'A-101', total:15000, paid:10000, balance:5000, dueDate:'2024-07-31', status:'Partial', year:'2024-2025' },
  { fee_id:'HF003', student:'Rohit Ravi',    regNo:'ATL-2024-006', hostel:'Boys Hostel A',  room:'A-101', total:15000, paid:15000, balance:0,    dueDate:'2024-07-31', status:'Paid',    year:'2024-2025' },
];

const ALLOC_DATA = [
  { allocation_id:'ALLOC001', student:'Ananya Sharma', regNo:'ATL-2024-001', className:'Grade 5-A', hostel:'Girls Hostel B', room:'B-101', bed:'B1', date:'2024-06-05', status:'Active', initial:'AS', color:'blue'   },
  { allocation_id:'ALLOC002', student:'Mohammed Arif', regNo:'ATL-2024-002', className:'Grade 3-A', hostel:'Boys Hostel A',  room:'A-101', bed:'A1', date:'2024-06-05', status:'Active', initial:'MA', color:'green'  },
  { allocation_id:'ALLOC003', student:'Rohit Ravi',    regNo:'ATL-2024-006', className:'Grade 7-A', hostel:'Boys Hostel A',  room:'A-101', bed:'A2', date:'2024-06-05', status:'Active', initial:'RR', color:'purple' },
];

// ═══════════════════════════════════════════════════════════════════════
// MAIN
// ═══════════════════════════════════════════════════════════════════════
async function seed() {
  console.log('\n╔══════════════════════════════════════════╗');
  console.log('║  SMS Final — API-Based Data Seed         ║');
  console.log('╚══════════════════════════════════════════╝\n');

  // 1. Bootstrap all AdminUsers via seed endpoint (no direct DB)
  console.log('► Bootstrapping AdminUsers...');
  const bRes = await api.post('/seed-bootstrap', { secret: SECRET, users: ALL_ADMIN_USERS });
  if (!bRes || bRes.status === undefined) {
    console.log('  ❌ Cannot reach backend. Is it running on http://localhost:4000 ?');
    process.exit(1);
  }
  if (bRes.status === 200) {
    bRes.data.results.forEach(r => console.log(`  ${r.created ? '✅' : '⏭ '} ${r.email}`));
  } else if (bRes.status === 404) {
    console.log('  ❌ /seed-bootstrap route not found — restart the backend (npm run dev) to load seed.routes.js');
    process.exit(1);
  } else {
    console.log('  ❌ Bootstrap failed:', JSON.stringify(bRes.data));
    process.exit(1);
  }
  console.log();

  // 2. Login
  console.log('► Logging in...');
  TOKEN = await login('superadmin@atelier.com', 'Admin@123');
  console.log('  ✅ Logged in\n');

  // 3. Academic Year
  console.log('► Academic Years...');
  let academicYearId;
  for (const y of [
    { yearsbyname:'2023-2024', startdate:'2023-06-01', enddate:'2024-03-31', is_active:false },
    { yearsbyname:'2024-2025', startdate:'2024-06-01', enddate:'2025-03-31', is_active:true  },
    { yearsbyname:'2025-2026', startdate:'2025-06-01', enddate:'2026-03-31', is_active:false },
  ]) {
    const res = await post('/school/academicyear', y, `AcademicYear: ${y.yearsbyname}`);
    if (y.yearsbyname === '2024-2025' && res?.id) academicYearId = res.id;
  }
  if (!academicYearId) {
    const rows = await getAll('/school/academicyear');
    academicYearId = rows.find(r => r.yearsbyname === '2024-2025')?.id || rows[0]?.id;
  }
  console.log();

  // 4. Classes
  console.log('► Classes...');
  for (const c of CLASSES) await post('/school/class', c, `Class: ${c.name} ${c.section}`);
  const classRows = await getAll('/school/class');
  console.log();

  // 5. Subjects
  console.log('► Subjects...');
  for (const s of SUBJECTS) await post('/subject/subject', s, `Subject: ${s.name}`);
  const subjectRows = await getAll('/subject/subject');
  console.log();

  // 6. Classrooms
  console.log('► Classrooms...');
  for (const r of CLASSROOMS) await post('/school/classroom', r, `Classroom: ${r.room_no}`);
  console.log();

  // 7. Teachers
  console.log('► Teachers...');
  for (const t of TEACHERS_DATA) await post('/teacher', t, `Teacher: ${t.name}`);
  const teacherRows = await getAll('/teacher');
  console.log();

  // 8. Parents
  console.log('► Parents...');
  for (const p of PARENTS_DATA) await post('/parent', p, `Parent: ${p.name}`);
  const parentRows = await getAll('/parent');
  console.log();

  // 9. Guardians
  console.log('► Guardians...');
  for (const g of GUARDIANS_DATA) await post('/guardian', g, `Guardian: ${g.name}`);
  console.log();

  // 10. Students
  console.log('► Students...');
  const STUDENTS = [
    { name:'Ananya Sharma',   gender:'Female', age:12, address:'12 MG Road, Chennai',     date_of_birth:'2012-04-10', yearofjoining:2020, roll_number:101, blood_group:'A+',  admission_number:'ATL-2024-001', admission_date:'2020-06-01', academic_year:'2024-2025', parent_id: parentRows[0]?.id },
    { name:'Mohammed Arif',   gender:'Male',   age:10, address:'45 Anna Nagar, Chennai',   date_of_birth:'2014-08-19', yearofjoining:2021, roll_number:102, blood_group:'B+',  admission_number:'ATL-2024-002', admission_date:'2021-06-01', academic_year:'2024-2025', parent_id: parentRows[1]?.id },
    { name:'Kavya Mathew',    gender:'Female', age:9,  address:'7 Velachery, Chennai',     date_of_birth:'2015-12-05', yearofjoining:2022, roll_number:103, blood_group:'O+',  admission_number:'ATL-2024-003', admission_date:'2022-06-01', academic_year:'2024-2025', parent_id: parentRows[2]?.id },
    { name:'Joseph Nair',     gender:'Male',   age:8,  address:'3 T Nagar, Chennai',       date_of_birth:'2016-03-22', yearofjoining:2022, roll_number:104, blood_group:'AB+', admission_number:'ATL-2024-004', admission_date:'2022-06-01', academic_year:'2024-2025', parent_id: parentRows[3]?.id },
    { name:'Ayesha Babu',     gender:'Female', age:11, address:'88 Adyar, Chennai',        date_of_birth:'2013-05-13', yearofjoining:2020, roll_number:105, blood_group:'B-',  admission_number:'ATL-2024-005', admission_date:'2020-06-01', academic_year:'2024-2025', parent_id: parentRows[4]?.id },
    { name:'Rohit Ravi',      gender:'Male',   age:13, address:'22 Kilpauk, Chennai',      date_of_birth:'2011-07-09', yearofjoining:2019, roll_number:106, blood_group:'O-',  admission_number:'ATL-2024-006', admission_date:'2019-06-01', academic_year:'2024-2025', parent_id: parentRows[0]?.id },
    { name:'Nisha Fernandez', gender:'Female', age:14, address:'5 Mylapore, Chennai',      date_of_birth:'2010-11-25', yearofjoining:2018, roll_number:107, blood_group:'A-',  admission_number:'ATL-2024-007', admission_date:'2018-06-01', academic_year:'2024-2025', parent_id: parentRows[1]?.id },
    { name:'Arjun Iyer',      gender:'Male',   age:15, address:'14 Besant Nagar, Chennai', date_of_birth:'2009-02-14', yearofjoining:2017, roll_number:108, blood_group:'AB-', admission_number:'ATL-2024-008', admission_date:'2017-06-01', academic_year:'2024-2025', parent_id: parentRows[2]?.id },
    { name:'Divya Selvam',    gender:'Female', age:10, address:'9 Tambaram, Chennai',      date_of_birth:'2014-09-30', yearofjoining:2021, roll_number:109, blood_group:'B+',  admission_number:'ATL-2024-009', admission_date:'2021-06-01', academic_year:'2024-2025', parent_id: parentRows[3]?.id },
    { name:'Pradeep Kumar',   gender:'Male',   age:12, address:'33 Porur, Chennai',        date_of_birth:'2012-01-17', yearofjoining:2020, roll_number:110, blood_group:'O+',  admission_number:'ATL-2024-010', admission_date:'2020-06-01', academic_year:'2024-2025', parent_id: parentRows[4]?.id },
  ];
  for (const s of STUDENTS) {
    if (!s.parent_id) { console.log(`  ⚠️  Skip ${s.name} — no parent`); continue; }
    await post('/student', s, `Student: ${s.name}`);
  }
  const studentRows = await getAll('/student');
  console.log();

  // 11. Holidays
  console.log('► Holidays...');
  for (const h of HOLIDAYS_DATA) await post('/holiday', h, `Holiday: ${h.title}`);
  console.log();

  // 12. Leave — route is /leave-requests (dashboard leave route)
  console.log('► Leave Records...');
  for (const l of LEAVES_DATA) await post('/leave-requests', l, `Leave: ${l.employee_name}`);
  console.log();

  // 13. HR Candidates
  console.log('► HR Candidates...');
  for (const h of HR_DATA) await post('/hr', h, `HR: ${h.name}`);
  console.log();

  // 14. Payroll
  console.log('► Payroll...');
  for (const p of PAYROLL_DATA) await post('/hr/payroll', p, `Payroll: ${p.name} — ${p.month}`);
  console.log();

  // 15. Fees Groups
  console.log('► Fee Groups...');
  for (const f of FEES_DATA) await post('/management/fees', f, `Fee: ${f.group}`);
  console.log();

  // 16. Library Members
  console.log('► Library Members...');
  for (const m of LIBRARY_DATA) await post('/management/library-member', m, `Library: ${m.name}`);
  console.log();

  // 17. Sports
  console.log('► Sports...');
  for (const s of SPORTS_DATA) await post('/management/sports', s, `Sport: ${s.name}`);
  console.log();

  // 18. Transport Buses
  console.log('► Transport Buses...');
  for (const b of BUSES_DATA) await post('/management/transport/buses', b, `Bus: ${b.busNumber}`);
  console.log();

  // 19. Transport Routes
  console.log('► Transport Routes...');
  for (const r of ROUTES_DATA) await post('/management/transport/routes', r, `Route: ${r.name}`);
  console.log();

  // 20. Hostels
  console.log('► Hostels...');
  for (const h of HOSTELS_DATA) await post('/hostel/hostelsetup', h, `Hostel: ${h.name}`);
  console.log();

  // 21. Hostel Rooms (no room_id field — DTO doesn't require it)
  console.log('► Hostel Rooms...');
  for (const r of ROOMS_DATA) await post('/hostel/roommanagement', r, `Room: ${r.roomNo}`);
  console.log();

  // 22. Student Allocations
  console.log('► Hostel Allocations...');
  for (const a of ALLOC_DATA) await post('/hostel/studentallocation', a, `Allocation: ${a.student}`);
  console.log();

  // 23. Hostel Fees
  console.log('► Hostel Fees...');
  for (const f of HOSTEL_FEES_DATA) await post('/hostel/hostelfeemanagement', f, `HostelFee: ${f.student}`);
  console.log();

  // 24. Hostel Complaints (no complaint_id — DTO doesn't require it)
  console.log('► Complaints...');
  for (const c of COMPLAINTS_DATA) await post('/hostel/complaintsmaintenance', c, `Complaint: ${c.student}`);
  console.log();

  // 25. Admissions (route is /admission/admissions)
  console.log('► Admissions...');
  const firstClassId = classRows[0]?.id;
  let admissionIds = [];
  if (firstClassId) {
    const ADMISSIONS = [
      { student_name:'Riya Patel',   date_of_birth:'2016-03-10', gender:'Female', address:'25 Nungambakkam', addmission_number:'ADM-APP-001', class_applied_id:firstClassId, parent_name:'Meera Patel',  parent_number:'9800011001', parent_email:'meera@example.com',  quota_category:'General',    admission_status:'Enrolled',            registration_fee:500, total_amount:5000, payment_method:'CASH', payment_date:'2025-01-10', payment_status:'Completed' },
      { student_name:'Karan Singh',  date_of_birth:'2015-07-22', gender:'Male',   address:'12 Egmore',       addmission_number:'ADM-APP-002', class_applied_id:firstClassId, parent_name:'Ajay Singh',   parent_number:'9800011002', parent_email:'ajay@example.com',   quota_category:'General',    admission_status:'Interview Scheduled', registration_fee:500, total_amount:5000, payment_method:'UPI',  payment_date:'2025-01-15', payment_status:'Pending'   },
      { student_name:'Anita Sharma', date_of_birth:'2017-01-15', gender:'Female', address:'8 T Nagar',       addmission_number:'ADM-APP-003', class_applied_id:firstClassId, parent_name:'Sunil Sharma', parent_number:'9800011003', parent_email:'sunil@example.com',  quota_category:'management', admission_status:'Offer Sent',          registration_fee:500, total_amount:5000, payment_method:'CARD', payment_date:'2025-01-20', payment_status:'Pending'   },
      { student_name:'David Michael',date_of_birth:'2014-09-05', gender:'Male',   address:'5 Alwarpet',      addmission_number:'ADM-APP-004', class_applied_id:firstClassId, parent_name:'Paul Michael', parent_number:'9800011004', parent_email:'paul@example.com',   quota_category:'General',    admission_status:'Applied',             registration_fee:500, total_amount:5000, payment_method:'CASH', payment_date:'2025-01-25', payment_status:'Pending'   },
    ];
    for (const a of ADMISSIONS) {
      const res = await post('/admission/admissions', a, `Admission: ${a.student_name}`);
      if (res?.id) admissionIds.push(res.id);
    }
  }
  console.log();

  // 26. Interviews
  if (admissionIds.length > 0 && teacherRows.length > 0) {
    console.log('► Interviews...');
    for (let i = 0; i < Math.min(2, admissionIds.length); i++) {
      await post('/admission/interviews', {
        admission_id: admissionIds[i], teacher_id: teacherRows[i % teacherRows.length].id,
        interview_date: `2025-01-${15+i}T10:00:00.000Z`, location: 'Principal Office',
        status: i === 0 ? 'Completed' : 'Scheduled', documents_status: i === 0 ? 'Verified' : 'Pending'
      }, `Interview: ${admissionIds[i].slice(0,8)}`);
    }
    console.log();
  }

  // 27. Offer Letters
  if (admissionIds.length > 0) {
    console.log('► Offer Letters...');
    await post('/admission/offer-letters', {
      admission_id: admissionIds[0], letter_date: '2025-02-01T00:00:00.000Z',
      validity_date: '2025-03-01T00:00:00.000Z', status: 'Accepted', payment_status: 'Completed'
    }, `OfferLetter: ${admissionIds[0].slice(0,8)}`);
    console.log();
  }

  // 28. School Settings
  console.log('► School Settings...');
  const sr = await api.put('/school/settings', {
    academic_year:'2024-2025', academic_year_status:'Active',
    school_name:'Atelier School', school_address:'1 Education Lane, Chennai',
    school_phone:'+91 44 2000 0001', school_email:'info@atelier.edu',
    notif_exam:'true', notif_fee_payment:'true', notif_attendance:'true', notif_system_updates:'false',
  }, auth());
  console.log(sr.status < 300 ? '  ✅ Settings saved' : `  ❌ Settings: ${sr.status}`);
  console.log();

  // 29. Student Exams
  console.log('► Student Exams...');
  const SUBJ = ['Mathematics','English','Science','Social Science','Tamil'];
  for (const s of studentRows.slice(0, 5)) {
    for (let i = 0; i < 3; i++) {
      await post('/studentexam', {
        student_id: s.id, subject: SUBJ[i],
        exam_date: `2025-02-${10+i*2}`, start_time: '09:00', end_time: '12:00', room_no: `A-10${i+1}`
      }, `Exam: ${s.name} — ${SUBJ[i]}`);
    }
  }
  console.log();

  // Done
  console.log('╔══════════════════════════════════════════╗');
  console.log('║  ✅  SEED COMPLETE                        ║');
  console.log('╚══════════════════════════════════════════╝');
  console.log('\nCredentials:');
  console.log('  Super Admin  : superadmin@atelier.com / Admin@123');
  console.log('  School Admin : admin@atelier.com      / Admin@123');
  console.log('  Teacher      : teacher1@atelier.com   / Teacher@123');
  console.log('  Parent       : parent1@atelier.com    / Parent@123\n');
}

seed().catch(err => {
  if (err.code === 'ECONNREFUSED' || err.code === 'ECONNRESET') {
    console.error('\n❌ Cannot connect to backend at http://localhost:4000');
    console.error('   Start the backend first: npm run dev');
  } else {
    console.error('\n❌ Seed failed:', err.message);
  }
  process.exit(1);
});
