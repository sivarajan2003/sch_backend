//dashboardCard.models.js
import { sequelize } from "../../db/index.js";
import { DataTypes } from "sequelize";

const DashboardCard = sequelize.define(
  "DashboardCard",
  {
    id: {
      type: DataTypes.UUID,
      defaultValue: DataTypes.UUIDV4,
      primaryKey: true,
    },

    teacher_id: {
      type: DataTypes.UUID,
      allowNull: false,
    },

    completed_percentage: {
      type: DataTypes.INTEGER,
      defaultValue: 0,
    },

    pending_percentage: {
      type: DataTypes.INTEGER,
      defaultValue: 0,
    },

    rating: {
      type: DataTypes.FLOAT,
      defaultValue: 0,
    },
  },
  {
    tableName: "teacher_dashboard_cards",
  }
);

export default DashboardCard;