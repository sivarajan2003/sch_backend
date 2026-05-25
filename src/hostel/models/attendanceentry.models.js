import { sequelize } from '../../db/index.js';
import { DataTypes } from 'sequelize';

const AttendanceEntry = sequelize.define(
  'AttendanceEntry',
  {
    id: {
      type: DataTypes.UUID,
      defaultValue: DataTypes.UUIDV4,
      primaryKey: true,
    },

    student: DataTypes.STRING,

    regNo: DataTypes.STRING,

    hostel: DataTypes.STRING,

    room: DataTypes.STRING,

    checkIn: DataTypes.STRING,

    checkOut: DataTypes.STRING,

    status: DataTypes.STRING,

    entryType: DataTypes.STRING,

    initial: DataTypes.STRING,

    color: DataTypes.STRING,

    year: DataTypes.STRING,
  }
);

export default AttendanceEntry;