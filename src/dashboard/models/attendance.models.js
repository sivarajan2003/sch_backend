//attendance.models.js
import { sequelize } from "../../db/index.js";
import { DataTypes } from "sequelize";

const Attendance = sequelize.define(
  "Attendance",
  {
    id: {
      type: DataTypes.UUID,
      defaultValue: DataTypes.UUIDV4,
      primaryKey: true,
    },

    attendance_type: {
      type: DataTypes.ENUM(
        "Students",
        "Teachers",
        "Staff"
      ),
      allowNull: false,
    },

    present: {
      type: DataTypes.INTEGER,
      defaultValue: 0,
    },

    absent: {
      type: DataTypes.INTEGER,
      defaultValue: 0,
    },

    emergency: {
      type: DataTypes.INTEGER,
      defaultValue: 0,
    },

    late: {
      type: DataTypes.INTEGER,
      defaultValue: 0,
    },

    attendance_date: {
      type: DataTypes.DATEONLY,
      allowNull: false,
    },
  },
  {
    tableName: "attendance_dashboard",
    timestamps: true,
  }
);

export default Attendance;