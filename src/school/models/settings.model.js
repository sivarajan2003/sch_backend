// settings.model.js
import { sequelize } from '../../db/index.js';
import { DataTypes } from 'sequelize';

const Settings = sequelize.define('Settings', {
  id: {
    type: DataTypes.UUID,
    defaultValue: DataTypes.UUIDV4,
    primaryKey: true,
  },
  key: {
    type: DataTypes.STRING(100),
    allowNull: false,
    unique: true,
  },
  value: {
    type: DataTypes.TEXT,
    allowNull: true,
  },
  category: {
    type: DataTypes.STRING(50),
    allowNull: true,
    defaultValue: 'general',
  },
  label: {
    type: DataTypes.STRING(150),
    allowNull: true,
  },
  updated_by: {
    type: DataTypes.UUID,
    allowNull: true,
  },
  updated_by_name: {
    type: DataTypes.STRING,
    allowNull: true,
  },
}, {
  tableName: 'school_settings',
  timestamps: true,
  indexes: [
    { fields: ['key'], unique: true },
    { fields: ['category'] },
  ],
});

export default Settings;
