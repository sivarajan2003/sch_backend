import { sequelize } from '../../db/index.js';
import { DataTypes } from 'sequelize';

const Fees = sequelize.define("Fees", {
  id: {
    type: DataTypes.STRING,
    primaryKey: true
  },

  group: {
    type: DataTypes.STRING,
    allowNull: false
  },

  description: {
    type: DataTypes.TEXT
  },

  status: {
    type: DataTypes.ENUM("Active", "Inactive"),
    defaultValue: "Active"
  }

}, {
  tableName: "fees_group",
  timestamps: true
});

export default Fees;