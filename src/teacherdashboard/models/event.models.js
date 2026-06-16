//event.models.js
import { sequelize } from "../../db/index.js";
import { DataTypes } from "sequelize";

const Event = sequelize.define(
  "Event",
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

    description: {
      type: DataTypes.TEXT,
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

    location: {
      type: DataTypes.STRING,
    },
  },
  {
    tableName: "teacher_events",
    timestamps: true,
  }
);

export default Event;