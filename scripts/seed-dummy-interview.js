import { randomUUID } from 'crypto';
import { sequelize } from '../src/db/index.js';
import Admission from '../src/admission/models/admission.models.js';
import Interview from '../src/admission/models/interview.models.js';
import Teacher from '../src/teacher/models/teacher.models.js';

const filterFieldsByTable = async (tableName, payload) => {
  const queryInterface = sequelize.getQueryInterface();
  const tableInfo = await queryInterface.describeTable(tableName);
  const allowed = Object.keys(tableInfo);
  return Object.keys(payload).reduce((acc, key) => {
    if (allowed.includes(key)) {
      acc[key] = payload[key];
    }
    return acc;
  }, {});
};

const getActiveWhere = async (tableName) => {
  const queryInterface = sequelize.getQueryInterface();
  const tableInfo = await queryInterface.describeTable(tableName);
  if (Object.prototype.hasOwnProperty.call(tableInfo, 'is_active')) {
    return { is_active: true };
  }
  if (Object.prototype.hasOwnProperty.call(tableInfo, 'isActive')) {
    return { isActive: true };
  }
  if (Object.prototype.hasOwnProperty.call(tableInfo, 'status')) {
    return { status: 'Active' };
  }
  return {};
};

const createDummyAdmission = async () => {
  const admissionNumber = `ADM-${Date.now()}`;
  const data = {
    student_name: 'Dummy Student',
    date_of_birth: new Date('2018-01-01'),
    gender: 'Male',
    address: '123 Demo Street, Demo City',
    addmission_number: admissionNumber,
    class_applied_id: randomUUID(),
    parent_name: 'Dummy Parent',
    parent_number: '+919999999999',
    parent_email: 'dummy-parent@example.com',
    quota_category: 'General',
    registration_fee: 0,
    total_amount: 1,
    payment_method: 'CASH',
    payment_date: new Date(),
    payment_status: 'Completed',
    receipt_no: `RCPT-${Date.now()}`,
  };
  return await Admission.create(await filterFieldsByTable('admissions', data));
};

const createDummyTeacher = async () => {
  const data = {
    id: randomUUID(),
    name: 'Dummy Teacher',
    email: `dummy-teacher-${Date.now()}@example.com`,
    qualification: 'B.Ed',
    phone: '+919888888888',
    status: 'Active',
    createdAt: new Date(),
    updatedAt: new Date(),
  };
  const queryInterface = sequelize.getQueryInterface();
  await queryInterface.bulkInsert('teachers', [data]);
  return await Teacher.findOne({ where: { email: data.email }, attributes: ['id'], paranoid: false });
};

const main = async () => {
  try {
    await sequelize.authenticate();
    console.log('Database connected successfully.');

    const admissionWhere = await getActiveWhere('admissions');
    console.log('admissionWhere:', admissionWhere);
    let admission = await Admission.findOne({ where: admissionWhere, attributes: ['id'], paranoid: false });
    if (!admission) {
      console.log('No active admission found. Creating a dummy admission...');
      admission = await createDummyAdmission();
    }

    const teacherWhere = await getActiveWhere('teachers');
    console.log('teacherWhere:', teacherWhere);
    let teacher = await Teacher.findOne({ where: teacherWhere, attributes: ['id'], paranoid: false });
    if (!teacher) {
      console.log('No active teacher found. Creating a dummy teacher...');
      teacher = await createDummyTeacher();
    }

    const interview = await Interview.create({
      admission_id: admission.id,
      teacher_id: teacher.id,
      interview_date: new Date(Date.now() + 24 * 60 * 60 * 1000),
      location: 'Admin Office - Room 101',
      status: 'Scheduled',
      remarks: 'Dummy interview created by seed script',
    });

    console.log('Dummy interview created successfully:');
    console.log({
      interviewId: interview.id,
      admissionId: interview.admission_id,
      teacherId: interview.teacher_id,
      interviewDate: interview.interview_date,
      location: interview.location,
      status: interview.status,
    });
  } catch (error) {
    console.error('Failed to create dummy interview:', error);
    process.exit(1);
  } finally {
    await sequelize.close();
  }
};

main();
