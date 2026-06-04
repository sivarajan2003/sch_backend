//subject.models.js
import { sequelize } from '../../db/index.js';
import { DataTypes } from 'sequelize';

const Subject = sequelize.define("Subject", {
  id: {
    type: DataTypes.UUID,
    defaultValue: DataTypes.UUIDV4,
    primaryKey: true,
  },
  name: {
    type: DataTypes.STRING(100),
    allowNull: false,
  },
  code: {
    type: DataTypes.STRING(20),
    allowNull: true,
  },
  type: {
    type: DataTypes.ENUM('Theory', 'Practical'),
    defaultValue: 'Theory',
    allowNull: true,
  },
  is_active:{
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
    tableName: "subjects",
    timestamps: true,
    paranoid: true,
    indexes: [,
    { fields: ['is_active'] },
  ],
});

export default Subject;
