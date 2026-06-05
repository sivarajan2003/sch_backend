//studentNotice.models.js
import { sequelize } from "../../db/index.js";
import { DataTypes } from "sequelize";

const StudentNotice = sequelize.define(
  "StudentNotice",
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
      allowNull: true,
    },
student_id: {
  type: DataTypes.UUID,
  allowNull: false,
},
    notice_type: {
      type: DataTypes.ENUM(
        "Admin",
        "Class Teacher",
        "Subject Teacher"
      ),
      allowNull: false,
    },

    class_id: {
      type: DataTypes.UUID,
      allowNull: true,
    },

    subject: {
      type: DataTypes.STRING,
      allowNull: true,
    },

    created_by_name: {
      type: DataTypes.STRING,
      allowNull: true,
    },
  },
  {
    tableName: "student_notices",
    timestamps: true,
  }
);

export default StudentNotice;