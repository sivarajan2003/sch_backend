import { sequelize } from '../../db/index.js';
import { DataTypes } from 'sequelize';

const TransportRoute = sequelize.define("TransportRoute", {
  id: {
    type: DataTypes.STRING(50),
    primaryKey: true
  },
  name: {
    type: DataTypes.STRING(255),
    allowNull: false
  },
  busId: {
    type: DataTypes.STRING(50),
    allowNull: true
  },
  stops: {
    type: DataTypes.TEXT, // Store as stringified JSON array
    allowNull: false,
    defaultValue: "[]"
  },
  currentStopIndex: {
    type: DataTypes.INTEGER,
    allowNull: false,
    defaultValue: -1
  },
  status: {
    type: DataTypes.STRING(50),
    defaultValue: "Active"
  },
  // New shift field for Morning/Evening trips
  shift: {
    type: DataTypes.ENUM('Morning', 'Evening'),
    allowNull: false,
    defaultValue: 'Morning'
  },
  date: {
    type: DataTypes.STRING(100),
    allowNull: true
  }
}, {
  tableName: "transport_routes",
  timestamps: true
});

export default TransportRoute;