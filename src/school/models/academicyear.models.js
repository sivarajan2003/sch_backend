import { sequelize } from '../../db/index.js';
import { DataTypes } from 'sequelize';

const Academicyear = sequelize.define("Academicyear", {
    id: {
    type: DataTypes.UUID,
    defaultValue: DataTypes.UUIDV4,
    primaryKey: true,
  },
  yearsbyname: {
    type: DataTypes.STRING(100),
    allowNull: false,
  },
  startdate: {
    type: DataTypes.DATEONLY,
    allowNull: false,
  },
  enddate: {
    type: DataTypes.DATEONLY,
    allowNull: false,
  },
  is_active:{
    type: DataTypes.BOOLEAN,
    defaultValue: true,
  },
  created_by: {
    type: DataTypes.UUID,
    allowNull: true,
  },
  updated_by: {
    type: DataTypes.UUID,
    allowNull: true,
  },
  deleted_by: {
    type: DataTypes.UUID,
    allowNull: true,
  },
  created_by_name: {
    type: DataTypes.STRING,
    allowNull: true,
  },
  updated_by_name: {
    type: DataTypes.STRING,
    allowNull: true,
  },
  deleted_by_name: {
    type: DataTypes.STRING,
    allowNull: true,
  },
  created_by_email: {
    type: DataTypes.STRING,
    allowNull: true,
  },
  updated_by_email: {
    type: DataTypes.STRING,
    allowNull: true,
  },
  deleted_by_email: {
    type: DataTypes.STRING,
    allowNull: true,
  },
},

  {
    tableName: "academicyears",
    timestamps: true,
    paranoid: true,
    indexes: [
    { fields: ['is_active'] },
  ],
});

export default Academicyear;