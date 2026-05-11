import { sequelize } from '../../db/index.js';
import { DataTypes } from 'sequelize';

const LibraryMember = sequelize.define("LibraryMember", {

  id: {
    type: DataTypes.STRING,
    primaryKey: true
  },

  name: {
    type: DataTypes.STRING,
    allowNull: false
  },

  cardNo: {
    type: DataTypes.STRING,
    allowNull: false
  },

  email: {
    type: DataTypes.STRING,
    allowNull: false
  },

  mobile: {
    type: DataTypes.STRING
  },

  avatar: {
    type: DataTypes.TEXT
  }

}, {
  tableName: "library_members",
  timestamps: true
});

export default LibraryMember;