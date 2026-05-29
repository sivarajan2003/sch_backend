//timetable.models.js
import { sequelize } from '../../db/index.js';
import { DataTypes } from 'sequelize';

const Timetable = sequelize.define("Timetable", {
  id: {
    type: DataTypes.UUID,
    defaultValue: DataTypes.UUIDV4,
    primaryKey: true,
  },
  class_id: {
    type: DataTypes.UUID,
    allowNull: false,
  },
  subject_id: {
    type: DataTypes.UUID,
    allowNull: true,
  },
  academicyear_id: {
    type: DataTypes.UUID,
    allowNull: false,
  },
  teacher_id: {
  type: DataTypes.UUID,
  allowNull: true,
},

start_time: {
  type: DataTypes.TIME,
  allowNull: false,
},

end_time: {
  type: DataTypes.TIME,
  allowNull: false,
},

period_type: {
  type: DataTypes.ENUM(
    "CLASS",
    "BREAK",
    "LUNCH"
  ),
  defaultValue: "CLASS",
},
  day_of_week: {
    type: DataTypes.ENUM(
      "Monday",
      "Tuesday",
      "Wednesday",
      "Thursday",
      "Friday",
      "Saturday",
      "Sunday"
    ),
    allowNull: false,
  },
  period_number: {
    type: DataTypes.ENUM("1st", "2nd", "3rd", "4th", "5th", "6th", "7th", "8th"),
    allowNull: false,
  },
  is_active: {
    type: DataTypes.BOOLEAN,
    defaultValue: true,
  },

  // 🔹 Audit columns
  created_by: { type: DataTypes.UUID, allowNull: true },
  updated_by: { type: DataTypes.UUID, allowNull: true },
  deleted_by: { type: DataTypes.UUID, allowNull: true },

  created_by_name: { type: DataTypes.STRING, allowNull: true },
  updated_by_name: { type: DataTypes.STRING, allowNull: true },
  deleted_by_name: { type: DataTypes.STRING, allowNull: true },

  created_by_email: { type: DataTypes.STRING, allowNull: true },
  updated_by_email: { type: DataTypes.STRING, allowNull: true },
  deleted_by_email: { type: DataTypes.STRING, allowNull: true },
}, {
  tableName: "timetables",
  timestamps: true,
  paranoid: true,
  indexes: [
    { fields: ['is_active'] },
    { fields: ['day_of_week'] },
    { fields: ['class_id'] },
  ],
});

export default Timetable;
