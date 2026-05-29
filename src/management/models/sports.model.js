import { sequelize } from "../../db/index.js";
import { DataTypes } from "sequelize";

const Sports = sequelize.define(
  "Sports",
  {
    id: {
      type: DataTypes.UUID,
      defaultValue: DataTypes.UUIDV4,
      primaryKey: true,
    },

    sport_id: {
      type: DataTypes.STRING,
      allowNull: false,
      unique: true,
    },

    name: {
      type: DataTypes.STRING,
      allowNull: false,
    },

    coach: {
      type: DataTypes.STRING,
      allowNull: false,
    },

    avatar: {
      type: DataTypes.STRING,
      allowNull: true,
    },

    year: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },

    is_active: {
      type: DataTypes.BOOLEAN,
      defaultValue: true,
    },

    created_by: {
      type: DataTypes.UUID,
      allowNull: true,
    },

    updated_by: {
      type: DataTypes.UUID,
      allowNull: true,
    },

    deleted_by: {
      type: DataTypes.UUID,
      allowNull: true,
    },

    created_by_name: {
      type: DataTypes.STRING,
      allowNull: true,
    },

    updated_by_name: {
      type: DataTypes.STRING,
      allowNull: true,
    },

    deleted_by_name: {
      type: DataTypes.STRING,
      allowNull: true,
    },

    created_by_email: {
      type: DataTypes.STRING,
      allowNull: true,
    },

    updated_by_email: {
      type: DataTypes.STRING,
      allowNull: true,
    },

    deleted_by_email: {
      type: DataTypes.STRING,
      allowNull: true,
    },
  },
  {
    tableName: "sports",
    timestamps: true,
    paranoid: true,
  }
);

export default Sports;