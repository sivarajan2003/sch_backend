import { sequelize } from '../../db/index.js';
import { DataTypes } from 'sequelize';

const TransportStudent = sequelize.define("TransportStudent", {
  id: {
    type: DataTypes.STRING(50),
    primaryKey: true
  },
  studentId: {
    type: DataTypes.STRING(100),
    allowNull: false
  },
  studentName: {
    type: DataTypes.STRING(255),
    allowNull: false
  },
  rollNo: {
    type: DataTypes.STRING(50),
    allowNull: true
  },
  class: {
    type: DataTypes.STRING(100),
    allowNull: true
  },
  busId: {
    type: DataTypes.STRING(50),
    allowNull: false
  },
  stopName: {
    type: DataTypes.STRING(255),
    allowNull: false
  }
}, {
  tableName: "transport_students",
  timestamps: true
});

export default TransportStudent;
