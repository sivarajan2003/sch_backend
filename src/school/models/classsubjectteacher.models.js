import { sequelize } from '../../db/index.js';
import { DataTypes } from 'sequelize';
import Subject from '../../subject/models/subject.models.js';
import Teacher from '../../teacher/models/teacher.models.js';
import Academicyear from './academicyear.models.js';

const ClasssubjectTeacher = sequelize.define("ClasssubjectTeacher", {
    id: {
    type: DataTypes.UUID,
    defaultValue: DataTypes.UUIDV4,
    primaryKey: true,
  },
  class_id: {
    type: DataTypes.UUID,
    references: {
      model: 'classes',
      key: 'id',
    },
    allowNull: false,
  },
  subject_id: {
    type: DataTypes.UUID,
    references: {
      model: 'subjects',
      key: 'id',
    },
    allowNull: false,
  },
  teacher_id: {
    type: DataTypes.UUID,
    references: {
      model: 'teachers',
      key: 'id',
    },
    allowNull: false,
  },
  academicyear_id: {
    type: DataTypes.UUID,
    references: {
      model: 'academicyears',
      key: 'id',
    },
    allowNull: false,
  },
  is_active:{
    type: DataTypes.BOOLEAN,
    defaultValue: true,
  },
  created_by: {
    type: DataTypes.UUID,
    allowNull: true,
  },
  updated_by: {
    type: DataTypes.UUID,
    allowNull: true,
  },
  deleted_by: {
    type: DataTypes.UUID,
    allowNull: true,
  },
  created_by_name: {
    type: DataTypes.STRING,
    allowNull: true,
  },
  updated_by_name: {
    type: DataTypes.STRING,
    allowNull: true,
  },
  deleted_by_name: {
    type: DataTypes.STRING,
    allowNull: true,
  },
  created_by_email: {
    type: DataTypes.STRING,
    allowNull: true,
  },
  updated_by_email: {
    type: DataTypes.STRING,
    allowNull: true,
  },
  deleted_by_email: {
    type: DataTypes.STRING,
    allowNull: true,
  },
},

  {
    tableName: "classsubjectteachers",
    timestamps: true,
    paranoid: true,
    indexes: [
    { fields: ['is_active'] },
  ],
});

export default ClasssubjectTeacher;