import { sequelize } from "../../db/index.js";
import { DataTypes } from "sequelize";

const Transport = sequelize.define(
  "Transport",
  {
    id: {
      type: DataTypes.UUID,
      defaultValue: DataTypes.UUIDV4,
      primaryKey: true,
    },

    transport_id: {
      type: DataTypes.STRING,
      allowNull: false,
      unique: true,
    },

    route: {
      type: DataTypes.STRING,
      allowNull: false,
    },

    status: {
      type: DataTypes.ENUM(
        "Active",
        "Inactive"
      ),
      defaultValue: "Active",
    },

    date: {
      type: DataTypes.DATEONLY,
      allowNull: false,
    },
  },
  {
    tableName: "transports",
    timestamps: true,
  }
);

export default Transport;