import { sequelize } from '../../db/index.js';
import { DataTypes } from 'sequelize';

const Attendance = sequelize.define("Attendance", {
  id: {
    type: DataTypes.UUID,
    defaultValue: DataTypes.UUIDV4,
    primaryKey: true,
  },

  person_id: {
    type: DataTypes.UUID,
    allowNull: false,
  },

  person_name: {
    type: DataTypes.STRING,
    allowNull: false,
  },

  person_type: {
    type: DataTypes.ENUM("Student", "Teacher", "Staff"),
    allowNull: false,
  },

  attendance_status: {
    type: DataTypes.ENUM(
      "Present",
      "Absent",
      "Late",
      "Halfday",
      "Holiday"
    ),
    allowNull: false,
  },

  attendance_date: {
    type: DataTypes.DATEONLY,
    allowNull: false,
  },

  notes: {
    type: DataTypes.TEXT,
    allowNull: true,
  },

}, {
  tableName: "attendance",
  timestamps: true,
  indexes: [
    { fields: ['person_type'] },
    { fields: ['attendance_date'] },
    { fields: ['person_id', 'attendance_date'], unique: true },
  ],
});

export default Attendance;