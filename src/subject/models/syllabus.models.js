import { sequelize } from '../../db/index.js';
import { DataTypes } from 'sequelize';

const Syllabus = sequelize.define(
  "Syllabus",
  {
    id: {
      type: DataTypes.UUID,
      defaultValue: DataTypes.UUIDV4,
      primaryKey: true,
    },

    class_name: {
      type: DataTypes.STRING,
      allowNull: false,
    },

    section: {
      type: DataTypes.STRING,
      allowNull: false,
    },

    subject_group: {
      type: DataTypes.STRING,
      allowNull: false,
    },

    is_active: {
      type: DataTypes.BOOLEAN,
      defaultValue: true,
    }
  },
  {
    tableName: "syllabus",
    timestamps: true,
    paranoid: true
  }
);

export default Syllabus;