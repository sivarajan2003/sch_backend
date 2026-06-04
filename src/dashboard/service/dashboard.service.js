// //dashboard.service.js

import Student from '../../student/models/student.models.js';
import Teacher from '../../teacher/models/teacher.models.js';
import Subject from '../../subject/models/subject.models.js';

const getDashboardStats = async () => {

  const totalStudents = await Student.count();
  const activeStudents = await Student.count({
    where: { is_active: true }
  });
  const inactiveStudents = await Student.count({
    where: { is_active: false }
  });

  const totalTeachers = await Teacher.count();
  const activeTeachers = await Teacher.count({
    where: { is_active: true }
  });
  const inactiveTeachers = await Teacher.count({
    where: { is_active: false }
  });

  const totalSubjects = await Subject.count();
  const activeSubjects = await Subject.count({
    where: { is_active: true }
  });
  const inactiveSubjects = await Subject.count({
    where: { is_active: false }
  });

  return {
    totalStudents,
    activeStudents,
    inactiveStudents,
    studentPercent:
      totalStudents > 0
        ? Math.round((activeStudents / totalStudents) * 100)
        : 0,

    totalTeachers,
    activeTeachers,
    inactiveTeachers,
    teacherPercent:
      totalTeachers > 0
        ? Math.round((activeTeachers / totalTeachers) * 100)
        : 0,

    totalStaff: 0,
    activeStaff: 0,
    inactiveStaff: 0,
    staffPercent: 0,

    totalSubjects,
    activeSubjects,
    inactiveSubjects,
    subjectPercent:
      totalSubjects > 0
        ? Math.round((activeSubjects / totalSubjects) * 100)
        : 0,
  };
};

export default {
  getDashboardStats,
};
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

