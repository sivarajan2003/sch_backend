//studenttodo.models.js
import { sequelize } from "../../db/index.js";
import { DataTypes } from "sequelize";

const StudentTodo = sequelize.define(
  "StudentTodo",
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

    title: {
      type: DataTypes.STRING,
      allowNull: false,
    },

    time: {
      type: DataTypes.STRING,
    },

    status: {
      type: DataTypes.ENUM(
        "Completed",
        "Inprogress",
        "Yet to Start"
      ),
      defaultValue: "Yet to Start",
    },
  },
  {
    tableName: "student_todo",
    timestamps: true,
  }
);

export default StudentTodo;