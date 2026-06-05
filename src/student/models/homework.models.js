//homework.models.js
import { sequelize } from "../../db/index.js";
import { DataTypes } from "sequelize";

const Homework = sequelize.define(
  "Homework",
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

    title: {
      type: DataTypes.STRING,
      allowNull: false,
    },

    teacher_name: {
      type: DataTypes.STRING,
      allowNull: false,
    },

    due_date: {
      type: DataTypes.DATEONLY,
      allowNull: false,
    },

    progress: {
      type: DataTypes.INTEGER,
      defaultValue: 0,
    },
  },
  {
    tableName: "homeworks",
    timestamps: true,
  }
);

export default Homework;