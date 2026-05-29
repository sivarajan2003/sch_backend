import { sequelize } from '../../db/index.js';
import { DataTypes } from 'sequelize';

const Classroom = sequelize.define('Classroom', {
  id: {
    type: DataTypes.UUID,
    defaultValue: DataTypes.UUIDV4,
    primaryKey: true,
  },
  room_no: {
    type: DataTypes.STRING(20),
    allowNull: false,
    unique: true,
  },
  capacity: {
    type: DataTypes.INTEGER,
    allowNull: false,
  },
  is_active: {
    type: DataTypes.BOOLEAN,
    defaultValue: true,
  },
  created_by: { type: DataTypes.UUID, allowNull: true },
  updated_by: { type: DataTypes.UUID, allowNull: true },
  created_by_name: { type: DataTypes.STRING, allowNull: true },
  updated_by_name: { type: DataTypes.STRING, allowNull: true },
}, {
  tableName: 'classrooms',
  timestamps: true,
  paranoid: true,
});

export default Classroom;
