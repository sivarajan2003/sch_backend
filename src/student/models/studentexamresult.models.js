//studentexamresult.models.js
import { sequelize } from "../../db/index.js";
import { DataTypes } from "sequelize";

const StudentExamResult = sequelize.define(
  "StudentExamResult",
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

    quarter: {
      type: DataTypes.STRING,
      allowNull: false,
    },

    subject: {
      type: DataTypes.STRING,
      allowNull: false,
    },

    mark: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },
  },
  {
    tableName: "student_exam_results",
    timestamps: true,
  }
);

export default StudentExamResult;