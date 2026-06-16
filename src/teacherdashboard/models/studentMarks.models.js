//studentMarks.models.js
import { sequelize } from "../../db/index.js";
import { DataTypes } from "sequelize";

const StudentMarks = sequelize.define("StudentMarks", {
  id: {
    type: DataTypes.UUID,
    defaultValue: DataTypes.UUIDV4,
    primaryKey: true,
  },

  student_id: {
    type: DataTypes.UUID,
    allowNull: false,
  },

  student_name: {
    type: DataTypes.STRING,
  },

  class_name: {
    type: DataTypes.STRING,
  },

  section: {
    type: DataTypes.STRING,
  },

  marks_percentage: {
    type: DataTypes.FLOAT,
  },

  cgpa: {
    type: DataTypes.FLOAT,
  },

  status: {
    type: DataTypes.ENUM("Pass", "Fail"),
  },
});

export default StudentMarks;