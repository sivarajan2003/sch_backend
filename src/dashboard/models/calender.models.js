import { sequelize } from "../../db/index.js";
import { DataTypes } from "sequelize";

const CalendarEvent = sequelize.define(
  "CalendarEvent",
  {
    id: {
      type: DataTypes.UUID,
      defaultValue: DataTypes.UUIDV4,
      primaryKey: true,
    },

    title: {
      type: DataTypes.STRING,
      allowNull: false,
    },

    event_type: {
      type: DataTypes.ENUM(
        "Holiday",
        "Leave",
        "Exam",
        "Meeting",
        "Attendance"
      ),
      allowNull: false,
    },

    event_date: {
      type: DataTypes.DATEONLY,
      allowNull: false,
    },

    description: {
      type: DataTypes.TEXT,
      allowNull: true,
    },
  },
  {
    tableName: "calendar_events",
    timestamps: true,
  }
);

export default CalendarEvent;