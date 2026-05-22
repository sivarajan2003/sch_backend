import { sequelize } from '../../db/index.js';
import { DataTypes } from 'sequelize';

const HostelSetup = sequelize.define(
  'HostelSetup',
  {
    id: {
      type: DataTypes.UUID,
      defaultValue: DataTypes.UUIDV4,
      primaryKey: true,
    },

    hostel_id: {
      type: DataTypes.STRING,
      allowNull: false,
      unique: true,
    },

    name: {
      type: DataTypes.STRING,
      allowNull: false,
    },

    type: {
      type: DataTypes.ENUM('Boys', 'Girls', 'Staff'),
      allowNull: false,
    },

    rooms: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },

    capacity: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },

    warden: {
      type: DataTypes.STRING,
      allowNull: false,
    },

    status: {
      type: DataTypes.ENUM('Active', 'Inactive'),
      defaultValue: 'Active',
    },
  },
  {
    tableName: 'hostel_setups',
    timestamps: true,
    paranoid: true,
  }
);

export default HostelSetup;