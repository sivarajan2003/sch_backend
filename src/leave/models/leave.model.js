//leave.models.js

import { sequelize } from "../../db/index.js";
import { DataTypes } from "sequelize";

const Leave = sequelize.define(
  "Leave",
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

    leave_type: {
      type: DataTypes.STRING,
      allowNull: false,
    },

    from_date: {
      type: DataTypes.DATEONLY,
      allowNull: false,
    },

    to_date: {
      type: DataTypes.DATEONLY,
      allowNull: false,
    },

    reason: {
      type: DataTypes.TEXT,
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
  },
  {
    tableName: "leaves",
    timestamps: true,
  }
);

export default Leave;