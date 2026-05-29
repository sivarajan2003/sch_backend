import { sequelize } from '../../db/index.js';
import { DataTypes } from 'sequelize';

const ClassAllocation = sequelize.define('ClassAllocation', {
    id: {
        type: DataTypes.UUID,
        defaultValue: DataTypes.UUIDV4,
        primaryKey: true,
    },
    class_id: {
        type: DataTypes.UUID,
        allowNull: false,
    },
    admission_id: {
        type: DataTypes.UUID,
        allowNull: false,
    },
    allocated_by: {
        type: DataTypes.UUID,
        allowNull: false,
    },
    is_active: {
    type: DataTypes.BOOLEAN,
    defaultValue: true,
  },
  created_by: { type: DataTypes.UUID, allowNull: true },
  updated_by: { type: DataTypes.UUID, allowNull: true },
  deleted_by: { type: DataTypes.UUID, allowNull: true },
  created_by_name: { type: DataTypes.STRING, allowNull: true },
  updated_by_name: { type: DataTypes.STRING, allowNull: true },
  deleted_by_name: { type: DataTypes.STRING, allowNull: true },
  created_by_email: { type: DataTypes.STRING, allowNull: true },
  updated_by_email: { type: DataTypes.STRING, allowNull: true },
  deleted_by_email: { type: DataTypes.STRING, allowNull: true },
}, {
    tableName: 'class_allocations',
    timestamps: true,
    paranoid: true,
    indexes: [
        { fields: ['class_id'] },
        { fields: ['admission_id'] },
    ],
});

export default ClassAllocation;