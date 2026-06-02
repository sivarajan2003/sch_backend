import { sequelize } from '../../db/index.js';
import { DataTypes } from 'sequelize';

const Bus = sequelize.define("Bus", {
  id: {
    type: DataTypes.STRING(50),
    primaryKey: true
  },
  busNumber: {
    type: DataTypes.STRING(100),
    allowNull: false
  },
  plateNumber: {
    type: DataTypes.STRING(50),
    allowNull: false
  },
  capacity: {
    type: DataTypes.INTEGER,
    allowNull: false,
    defaultValue: 40
  },
  driverName: {
    type: DataTypes.STRING(100),
    allowNull: false
  },
  driverPhone: {
    type: DataTypes.STRING(50),
    allowNull: true
  },
  status: {
    type: DataTypes.STRING(50),
    defaultValue: "Active"
  }
}, {
  tableName: "transport_buses",
  timestamps: true
});

export default Bus;
