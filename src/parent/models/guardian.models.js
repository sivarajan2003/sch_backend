import { sequelize } from '../../db/index.js';
import { DataTypes } from 'sequelize';

const Guardian = sequelize.define("Guardian", {
  id: {
    type: DataTypes.UUID,
    defaultValue: DataTypes.UUIDV4,
    primaryKey: true,
  },

  guardian_id: {
    type: DataTypes.STRING,
    allowNull: false,
    unique: true,
  },

  name: {
    type: DataTypes.STRING,
    allowNull: false,
  },

  email: {
    type: DataTypes.STRING,
    allowNull: false,
  },

  phone: {
    type: DataTypes.STRING,
    allowNull: false,
  },

  child_name: {
    type: DataTypes.STRING,
    allowNull: false,
  },

  image: {
    type: DataTypes.TEXT,
    allowNull: true,
  },

  is_active: {
    type: DataTypes.BOOLEAN,
    defaultValue: true,
  }

}, {
  tableName: "guardians",
  timestamps: true,
  paranoid: true,
});

export default Guardian;