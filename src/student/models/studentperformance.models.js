//studentperformance.models.js
import { sequelize } from "../../db/index.js";
import { DataTypes } from "sequelize";

const StudentPerformance = sequelize.define(
  "StudentPerformance",
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

    period: {
      type: DataTypes.STRING,
      allowNull: false,
    },

    exam_score: {
      type: DataTypes.FLOAT,
      defaultValue: 0,
    },

    attendance_score: {
      type: DataTypes.FLOAT,
      defaultValue: 0,
    },
  },
  {
    tableName: "student_performance",
    timestamps: true,
  }
);

export default StudentPerformance;