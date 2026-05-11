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
  }

}, {
  tableName: "attendance",
  timestamps: true
});

export default Attendance;