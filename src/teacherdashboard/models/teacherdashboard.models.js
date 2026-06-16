//teacherdashboard.models.js
import { sequelize } from "../../db/index.js";
import { DataTypes } from "sequelize";

const TeacherTimetable = sequelize.define(
  "TeacherTimetable",
  {
    id: {
      type: DataTypes.UUID,
      defaultValue: DataTypes.UUIDV4,
      primaryKey: true,
    },

    teacher_id: {
      type: DataTypes.UUID,
      allowNull: false,
    },

    class_name: {
      type: DataTypes.STRING,
      allowNull: false,
    },

    section: {
      type: DataTypes.STRING,
      allowNull: false,
    },

    subject: {
      type: DataTypes.STRING,
      allowNull: false,
    },

    day_name: {
      type: DataTypes.STRING,
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
  },
  {
    tableName: "teacher_timetable",
    timestamps: true,
  }
);

export default TeacherTimetable;