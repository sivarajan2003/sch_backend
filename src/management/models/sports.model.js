import { sequelize } from '../../db/index.js';
import { DataTypes } from 'sequelize';

const Sports = sequelize.define('Sports', {
  name: { type: DataTypes.STRING, allowNull: false },
  coach: { type: DataTypes.STRING, allowNull: false },
  avatar: { type: DataTypes.STRING },
  year: { type: DataTypes.INTEGER, allowNull: false }
}, {
  tableName: 'sports',
  timestamps: true
});

export default Sports;