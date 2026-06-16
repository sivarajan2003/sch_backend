//syllabus.models.js
import { sequelize } from "../../db/index.js";
import { DataTypes } from "sequelize";

const Syllabus = sequelize.define(
  "Syllabus",
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

    class_name: {
      type: DataTypes.STRING,
      allowNull: false,
    },

    section: {
      type: DataTypes.STRING,
      allowNull: false,
    },

    subject: {
      type: DataTypes.STRING,
      allowNull: false,
    },

    topic: {
      type: DataTypes.STRING,
      allowNull: false,
    },

    progress: {
      type: DataTypes.INTEGER,
      defaultValue: 0,
    },
  },
  {
    tableName: "teacher_syllabus",
    timestamps: true,
  }
);

export default Syllabus;