//studentexam.models.js
import { sequelize } from '../../db/index.js';
import { DataTypes } from 'sequelize';

const StudentExam = sequelize.define(
  'StudentExam',
  {
    id: {
      type: DataTypes.UUID,
      defaultValue: DataTypes.UUIDV4,
      primaryKey: true,
    },

    student_id: {
      type: DataTypes.UUID,
      allowNull: false,
    },

    subject: {
      type: DataTypes.STRING,
      allowNull: false,
    },

    exam_date: {
      type: DataTypes.DATEONLY,
      allowNull: false,
    },

    start_time: {
      type: DataTypes.STRING,
      allowNull: false,
    },

    end_time: {
      type: DataTypes.STRING,
      allowNull: false,
    },

    room_no: {
      type: DataTypes.STRING,
      allowNull: false,
    },
  },
  {
    tableName: 'student_exams',
    timestamps: true,
  }
);

export default StudentExam;