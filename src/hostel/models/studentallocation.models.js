import { sequelize } from '../../db/index.js';

import { DataTypes } from 'sequelize';

const StudentAllocation = sequelize.define(
  'StudentAllocation',
  {
    id: {
      type: DataTypes.UUID,
      defaultValue: DataTypes.UUIDV4,
      primaryKey: true,
    },

    allocation_id: {
      type: DataTypes.STRING,
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

    className: {
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

    bed: {
      type: DataTypes.STRING,
      allowNull: false,
    },

    date: {
      type: DataTypes.DATEONLY,
      allowNull: false,
    },

    status: {
      type: DataTypes.ENUM(
        'Active',
        'Pending'
      ),
      defaultValue: 'Active',
    },

    initial: {
      type: DataTypes.STRING,
    },

    color: {
      type: DataTypes.STRING,
      defaultValue: 'blue',
    },
  },
  {
    tableName: 'student_allocations',
    timestamps: true,
  }
);

export default StudentAllocation;