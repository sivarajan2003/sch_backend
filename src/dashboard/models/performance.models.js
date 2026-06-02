//performance.models.js
import { sequelize } from "../../db/index.js";
import { DataTypes } from "sequelize";

const Performance = sequelize.define(
  "Performance",
  {
    id: {
      type: DataTypes.UUID,
      defaultValue: DataTypes.UUIDV4,
      primaryKey: true,
    },

    class_name: {
      type: DataTypes.STRING,
      allowNull: false,
      unique: true,
    },

    top_students: {
      type: DataTypes.INTEGER,
      defaultValue: 0,
    },

    average_students: {
      type: DataTypes.INTEGER,
      defaultValue: 0,
    },

    below_average_students: {
      type: DataTypes.INTEGER,
      defaultValue: 0,
    },

    performance_percentage: {
      type: DataTypes.FLOAT,
      defaultValue: 0,
    },
  },
  {
    tableName: "performance_stats",
    timestamps: true,
  }
);

export default Performance;