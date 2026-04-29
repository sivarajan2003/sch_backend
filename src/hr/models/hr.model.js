//hr.models.js
import { sequelize } from '../../db/index.js';
import { DataTypes } from 'sequelize';

const HR = sequelize.define("HR", {
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

  phone: {
    type: DataTypes.STRING,
  },

  qualification: {
    type: DataTypes.STRING,
  },

  status: {
    type: DataTypes.ENUM("Interview", "Selected", "Rejected"),
    defaultValue: "Interview",
  },

  salary_pending: {
    type: DataTypes.FLOAT,
    defaultValue: 0,
  }

}, {
  tableName: "hr",
  timestamps: true,
});

export default HR;