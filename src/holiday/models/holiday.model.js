import { sequelize } from "../../db/index.js";
import { DataTypes } from "sequelize";

const Holiday = sequelize.define(
  "Holiday",
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

    from_date: {
      type: DataTypes.DATEONLY,
      allowNull: false,
    },

    to_date: {
      type: DataTypes.DATEONLY,
      allowNull: false,
    },

    description: {
      type: DataTypes.TEXT,
      allowNull: false,
    }
  },
  {
    tableName: "holiday",
    timestamps: true
  }
);

export default Holiday;