import { sequelize } from '../../db/index.js';
import { DataTypes } from 'sequelize';

const ComplaintsMaintenance = sequelize.define(
  'ComplaintsMaintenance',
  {
    id: {
      type: DataTypes.UUID,
      defaultValue: DataTypes.UUIDV4,
      primaryKey: true,
    },

    complaint_id: {
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
      allowNull: true,
    },

    hostel: {
      type: DataTypes.STRING,
      allowNull: false,
    },

    room: {
      type: DataTypes.STRING,
      allowNull: false,
    },

    issue: {
      type: DataTypes.STRING,
      allowNull: false,
    },

    priority: {
      type: DataTypes.ENUM('High', 'Medium', 'Low'),
      allowNull: false,
    },

    status: {
      type: DataTypes.ENUM(
        'Pending',
        'In Progress',
        'Resolved'
      ),
      defaultValue: 'Pending',
    },

    date: {
      type: DataTypes.DATEONLY,
      allowNull: false,
    },

    color: {
      type: DataTypes.STRING,
      defaultValue: 'blue',
    },

    created_by: {
      type: DataTypes.UUID,
      allowNull: true,
    },

    updated_by: {
      type: DataTypes.UUID,
      allowNull: true,
    },
  },

  {
    tableName: 'complaints_maintenance',
    timestamps: true,
    paranoid: true,
  }
);

export default ComplaintsMaintenance;