//studentactivity.models.js
import { sequelize } from "../../db/index.js";
import { DataTypes } from "sequelize";

const StudentActivity = sequelize.define(
  "StudentActivity",
  {
    id: {
      type: DataTypes.UUID,
      defaultValue: DataTypes.UUIDV4,
      primaryKey: true,
    },

    title: DataTypes.STRING,

    description: DataTypes.TEXT,

    image: DataTypes.STRING,

    is_active: {
      type: DataTypes.BOOLEAN,
      defaultValue: true,
    },
  },
  {
    tableName: "student_activities",
    timestamps: true,
  }
);

export default StudentActivity;