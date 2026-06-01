// //dashboard.service.js
// import Student from '../../student/models/student.models.js';
// import Teacher from '../../teacher/models/teacher.models.js';
// //import Staff from '../../hr/models/hrmodel.js';
// import Subject from '../../subject/models/subject.models.js';
// const getDashboardStats = async () => {
//   const [
//     totalStudents,
//     totalTeachers,
//     totalStaff,
//     totalSubjects,
//   ] = await Promise.all([
//     Student.count(),
//     Teacher.count(),
//     Staff.count(),
//     Subject.count(),
//   ]);

//   return {
//     totalStudents: totalStudents || 0,
//     totalTeachers: totalTeachers || 0,
//     totalStaff: totalStaff || 0,
//     totalSubjects: totalSubjects || 0,
//   };
// };

// export default {
//   getDashboardStats,
// };

import Student from '../../student/models/student.models.js';
import Teacher from '../../teacher/models/teacher.models.js';

const getDashboardStats = async () => {
  const [
    totalStudents,
    totalTeachers
  ] = await Promise.all([
    Student.count(),
    Teacher.count(),
  ]);

  return {
    totalStudents,
    totalTeachers,
    totalStaff: 0,
    totalSubjects: 0,
  };
};

export default {
  getDashboardStats,
};