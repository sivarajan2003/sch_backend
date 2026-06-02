//upcomingeven.models.js
import { sequelize } from "../../db/index.js";
import { DataTypes } from "sequelize";

const UpcomingEvent = sequelize.define(
  "UpcomingEvent",
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

    event_date: {
      type: DataTypes.DATEONLY,
      allowNull: false,
    },

    start_time: {
      type: DataTypes.STRING,
      allowNull: false,
    },

    end_time: {
      type: DataTypes.STRING,
      allowNull: false,
    },

    color: {
      type: DataTypes.STRING,
      defaultValue: "blue",
    },

    event_type: {
      type: DataTypes.STRING,
      defaultValue: "Meeting",
    }
  },
  {
    tableName: "upcoming_events",
    timestamps: true,
  }
);

export default UpcomingEvent;