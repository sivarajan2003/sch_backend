//noticeboard.model.js
import { sequelize } from "../../db/index.js";
import { DataTypes } from "sequelize";

const NoticeBoard = sequelize.define(
  "NoticeBoard",
  {
    id: {
      type: DataTypes.UUID,
      defaultValue: DataTypes.UUIDV4,
      primaryKey: true,
    },

    title: {
      type: DataTypes.STRING(255),
      allowNull: false,
    },

    description: {
      type: DataTypes.TEXT,
      allowNull: false,
    },

    notice_date: {
      type: DataTypes.DATEONLY,
      allowNull: false,
    },

    expiry_days: {
      type: DataTypes.INTEGER,
      defaultValue: 0,
    },

    notice_type: {
      type: DataTypes.STRING(50),
      defaultValue: "General",
    },

    is_active: {
      type: DataTypes.BOOLEAN,
      defaultValue: true,
    },
  },
  {
    tableName: "notice_board",
    timestamps: true,
  }
);

export default NoticeBoard;