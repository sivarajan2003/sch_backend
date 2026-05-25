import { sequelize } from '../../db/index.js';
import { DataTypes } from 'sequelize';

const HostelFeeManagement = sequelize.define(
  'HostelFeeManagement',
  {
    id: {
      type: DataTypes.UUID,
      defaultValue: DataTypes.UUIDV4,
      primaryKey: true,
    },

    fee_id: {
      type: DataTypes.STRING,
      allowNull: false,
      unique: true,
    },

    student: {
      type: DataTypes.STRING,
      allowNull: false,
    },

    regNo: {
      type: DataTypes.STRING,
      allowNull: false,
    },

    hostel: {
      type: DataTypes.STRING,
      allowNull: false,
    },

    room: {
      type: DataTypes.STRING,
      allowNull: false,
    },

    total: {
      type: DataTypes.FLOAT,
      allowNull: false,
    },

    paid: {
      type: DataTypes.FLOAT,
      allowNull: false,
    },

    balance: {
      type: DataTypes.FLOAT,
      allowNull: false,
    },

    dueDate: {
      type: DataTypes.STRING,
      allowNull: false,
    },

    status: {
      type: DataTypes.STRING,
      defaultValue: 'Paid',
    },

    year: {
      type: DataTypes.STRING,
      allowNull: false,
    },
  },
  {
    tableName: 'hostelfeemanagement',
    timestamps: true,
  }
);

export default HostelFeeManagement;