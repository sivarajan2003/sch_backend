//teacher.model.js
import { sequelize } from "../../db/index.js";
import { DataTypes } from "sequelize";

const Teacher = sequelize.define(
  "Teacher",
  {
    id: {
      type: DataTypes.UUID,
      defaultValue: DataTypes.UUIDV4,
      primaryKey: true,
    },

    name: {
      type: DataTypes.STRING,
      allowNull: false,
    },

    email: {
      type: DataTypes.STRING,
      allowNull: false,
    },

    qualification: {
      type: DataTypes.STRING,
    },

    phone: {
      type: DataTypes.STRING,
    },

    status: {
      type: DataTypes.STRING,
      defaultValue: "Active",
    },
  },
  {
    tableName: "teachers",
    timestamps: true,
  }
);

export default Teacher;