//topsubject.models.js
import { sequelize } from "../../db/index.js";
import { DataTypes } from "sequelize";

const TopSubject = sequelize.define(
  "TopSubject",
  {
    id: {
      type: DataTypes.UUID,
      defaultValue: DataTypes.UUIDV4,
      primaryKey: true,
    },

    class_name: {
      type: DataTypes.STRING(50),
      allowNull: false,
    },

    subject_name: {
      type: DataTypes.STRING(100),
      allowNull: false,
    },

    completion_percentage: {
      type: DataTypes.INTEGER,
      defaultValue: 0,
    },

    color: {
      type: DataTypes.STRING(30),
      defaultValue: "blue",
    },

    is_active: {
      type: DataTypes.BOOLEAN,
      defaultValue: true,
    },
  },
  {
    tableName: "dashboard_top_subjects",
    timestamps: true,
  }
);

export default TopSubject;