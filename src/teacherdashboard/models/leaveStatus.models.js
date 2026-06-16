//leaveStatus.models.js
import { sequelize } from "../../db/index.js";
import { DataTypes } from "sequelize";

const LeaveStatus = sequelize.define("LeaveStatus", {
  id: {
    type: DataTypes.UUID,
    defaultValue: DataTypes.UUIDV4,
    primaryKey: true,
  },

  leave_type: {
    type: DataTypes.STRING,
  },

  leave_date: {
    type: DataTypes.DATEONLY,
  },

  status: {
    type: DataTypes.ENUM(
      "Pending",
      "Approved",
      "Declined"
    ),
  },
});

export default LeaveStatus;
