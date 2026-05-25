//roommanagement.models.js
import { sequelize } from '../../db/index.js';
import { DataTypes } from 'sequelize';

const RoomManagement = sequelize.define(
  'RoomManagement',
  {
    id: {
      type: DataTypes.UUID,
      defaultValue: DataTypes.UUIDV4,
      primaryKey: true,
    },

    room_id: {
      type: DataTypes.STRING,
      allowNull: false,
      unique: true,
    },

    roomNo: {
      type: DataTypes.STRING,
      allowNull: false,
    },

    hostel: {
      type: DataTypes.STRING,
      allowNull: false,
    },

    floor: {
      type: DataTypes.STRING,
      allowNull: false,
    },

    capacity: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },

    occupied: {
      type: DataTypes.INTEGER,
      defaultValue: 0,
    },

    type: {
      type: DataTypes.STRING,
      allowNull: false,
    },

    status: {
      type: DataTypes.ENUM(
        'Available',
        'Full',
        'Maintenance'
      ),
      defaultValue: 'Available',
    },
  },
  {
    tableName: 'room_management',
    timestamps: true,
  }
);

export default RoomManagement;