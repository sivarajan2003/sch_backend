//payroll.model.js
import { sequelize } from "../../db/index.js";
import { DataTypes } from "sequelize";

const Payroll = sequelize.define("Payroll", {
  id: {
    type: DataTypes.UUID,
    defaultValue: DataTypes.UUIDV4,
    primaryKey: true,
  },

  name: {
    type: DataTypes.STRING,
    allowNull: false,
  },

  basic: {
    type: DataTypes.FLOAT,
    allowNull: false,
  },

  allowance: {
    type: DataTypes.FLOAT,
    defaultValue: 0,
  },

  deduction: {
    type: DataTypes.FLOAT,
    defaultValue: 0,
  },

  netSalary: {
    type: DataTypes.FLOAT,
  },

  month: {
    type: DataTypes.STRING,
  },

  status: {
    type: DataTypes.ENUM("Pending", "Paid"),
    defaultValue: "Pending",
  }

}, {
  tableName: "payroll",
  timestamps: true,
});

export default Payroll;