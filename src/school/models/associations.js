/**
 * All Sequelize associations for the school module.
 * Import this file ONCE at app startup (src/index.js) after all models are loaded.
 * Centralising associations here avoids circular import issues.
 */
import Academicyear from './academicyear.models.js';
import Class from './class.models.js';
import ClasssubjectTeacher from './classsubjectteacher.models.js';
import Academicyearconfig from './academicconfig.models.js';
import Timetable from './timetable.models.js';
import Subject from '../../subject/models/subject.models.js';
import Teacher from '../../teacher/models/teacher.models.js';
import Admission from '../../admission/models/admission.models.js';
import ClassAllocation from '../../admission/models/classallocation.models.js';

// Academicyear -> ClasssubjectTeacher (one-to-many)
Academicyear.hasMany(ClasssubjectTeacher, {
  foreignKey: 'academicyear_id',
  as: 'ClasssubjectTeachers',
});
ClasssubjectTeacher.belongsTo(Academicyear, {
  foreignKey: 'academicyear_id',
  as: 'Academicyear',
});

// Class -> ClasssubjectTeacher (one-to-many)
Class.hasMany(ClasssubjectTeacher, {
  foreignKey: 'class_id',
  as: 'ClasssubjectTeachers',
});
ClasssubjectTeacher.belongsTo(Class, {
  foreignKey: 'class_id',
  as: 'Class',
});

// Subject -> ClasssubjectTeacher (one-to-many)
ClasssubjectTeacher.belongsTo(Subject, {
  foreignKey: 'subject_id',
  as: 'Subject',
});

// Teacher -> ClasssubjectTeacher (one-to-many)
ClasssubjectTeacher.belongsTo(Teacher, {
  foreignKey: 'teacher_id',
  as: 'Teacher',
});

// Academicyearconfig associations
Academicyearconfig.belongsTo(Academicyear, {
  foreignKey: 'academicyear_id',
  as: 'academicyear',
});
Academicyearconfig.belongsTo(Class, {
  foreignKey: 'class_id',
  as: 'class',
});
Academicyearconfig.belongsTo(Teacher, {
  foreignKey: 'class_teacher_id',
  as: 'classTeacher',
});
Academicyear.hasMany(Academicyearconfig, {
  foreignKey: 'academicyear_id',
  as: 'configs',
});

// Admission -> Class
Admission.belongsTo(Class, { foreignKey: 'class_applied_id', as: 'classDetails' });
Class.hasMany(Admission, { foreignKey: 'class_applied_id', as: 'Admissions' });

// ClassAllocation -> Admission & Class
ClassAllocation.belongsTo(Admission, { foreignKey: 'admission_id', as: 'admission' });
ClassAllocation.belongsTo(Class, { foreignKey: 'class_id', as: 'class' });

// Timetable associations
Timetable.belongsTo(Class, { foreignKey: 'class_id', as: 'Class' });
Timetable.belongsTo(Subject, { foreignKey: 'subject_id', as: 'Subject' });
Timetable.belongsTo(Academicyear, { foreignKey: 'academicyear_id', as: 'Academicyear' });