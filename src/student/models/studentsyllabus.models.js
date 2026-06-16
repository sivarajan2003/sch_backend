//studentsyllabus.models.js
import { sequelize } from "../../db/index.js";
import { DataTypes } from "sequelize";

const StudentSyllabus = sequelize.define(
  "StudentSyllabus",
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

    completion_percentage: {
      type: DataTypes.INTEGER,
      defaultValue: 0,
    },

    color: {
      type: DataTypes.STRING,
      defaultValue: "bg-blue-500",
    },
  },
  {
    tableName: "student_syllabus",
    timestamps: true,
  }
);

export default StudentSyllabus;