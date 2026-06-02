//todo.models.js
import { sequelize } from "../../db/index.js";
import { DataTypes } from "sequelize";

const Todo = sequelize.define(
  "Todo",
  {
    id: {
      type: DataTypes.UUID,
      defaultValue: DataTypes.UUIDV4,
      primaryKey: true,
    },

    title: DataTypes.STRING,

    time: DataTypes.STRING,

    status: {
      type: DataTypes.ENUM(
        "Completed",
        "Inprogress",
        "Yet to Start"
      ),
      defaultValue: "Yet to Start",
    },

    is_active: {
      type: DataTypes.BOOLEAN,
      defaultValue: true,
    },
  },
  {
    tableName: "dashboard_todos",
    timestamps: true,
  }
);

export default Todo;