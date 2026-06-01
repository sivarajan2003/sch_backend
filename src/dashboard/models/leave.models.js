//leave.models.js
import { sequelize } from "../../db/index.js";
import { DataTypes } from "sequelize";

const LeaveRequest = sequelize.define(
  "LeaveRequest",
  {
    id: {
      type: DataTypes.UUID,
      defaultValue: DataTypes.UUIDV4,
      primaryKey: true,
    },

    employee_name: {
      type: DataTypes.STRING,
      allowNull: false,
    },

    employee_role: {
      type: DataTypes.STRING,
      allowNull: false,
    },

    leave_type: {
      type: DataTypes.ENUM(
        "Medical",
        "Emergency",
        "Casual",
        "Personal"
      ),
      allowNull: false,
    },

    leave_from: {
      type: DataTypes.DATEONLY,
      allowNull: false,
    },

    leave_to: {
      type: DataTypes.DATEONLY,
      allowNull: false,
    },

    applied_on: {
      type: DataTypes.DATEONLY,
      allowNull: false,
    },

    status: {
      type: DataTypes.ENUM(
        "Pending",
        "Approved",
        "Rejected"
      ),
      defaultValue: "Pending",
    },

    created_by: {
      type: DataTypes.UUID,
      allowNull: true,
    },

    updated_by: {
      type: DataTypes.UUID,
      allowNull: true,
    },
  },
  {
    tableName: "leave_requests",
    timestamps: true,
  }
);

export default LeaveRequest;