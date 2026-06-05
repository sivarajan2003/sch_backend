//studentFaculty.models.js
import { sequelize } from "../../db/index.js";
import { DataTypes } from "sequelize";

const StudentFaculty = sequelize.define(
  "StudentFaculty",
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

    teacher_name: {
      type: DataTypes.STRING,
      allowNull: false,
    },

    subject: {
      type: DataTypes.STRING,
      allowNull: false,
    },

    email: {
      type: DataTypes.STRING,
    },

    phone: {
      type: DataTypes.STRING,
    },

    image: {
      type: DataTypes.STRING,
    },
  },
  {
    tableName: "student_faculties",
    timestamps: true,
  }
);

export default StudentFaculty;