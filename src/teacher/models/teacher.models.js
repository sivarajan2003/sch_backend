import { sequelize } from '../../db/index.js';
import { DataTypes } from 'sequelize';
import User from '../../adminuser/models/adminuser.model.js';

const Teacher = sequelize.define("Teacher", {
    id: {
    type: DataTypes.UUID,
    defaultValue: DataTypes.UUIDV4,
    primaryKey: true,
  },
  name: {
    type: DataTypes.STRING(100),
    allowNull: false,
  },
  address: {
    type: DataTypes.TEXT,
    allowNull: false,
  },
  date_of_birth: {
    type: DataTypes.DATEONLY,
    allowNull: false,
  },
  gender: {
    type: DataTypes.ENUM("Male", "Female", "Other"),
    allowNull: false,
  },
  number:{
    type: DataTypes.STRING(15),
    allowNull: false,
  },
  email:{
    type: DataTypes.STRING(60),
    unique: true,
    allowNull: false,
  },
  user_id: {
    type: DataTypes.UUID,
    allowNull: true,
    references:{
        model: User,
        key: 'id',
    }
  },
  qualification:{
    type: DataTypes.STRING,
    allowNull: false,
  },
  hire_date:{
    type: DataTypes.DATE,
    defaultValue: DataTypes.NOW,
  },
  subjects: {
  type: DataTypes.JSON,
  allowNull: true,
},
  desgination:{
    type: DataTypes.ENUM("Head Master", "Assistant Teacher", "Teacher"),
    allowNull: true,
  },
  salary:{
    type: DataTypes.FLOAT,
    allowNull: true,
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
    tableName: "teachers",
    timestamps: true,
    paranoid: true,
    indexes: [
    { fields: ['user_id'] },
    { fields: ['is_active'] },
  ],
  });
  
  Teacher.associate = (models) => {
  Teacher.belongsTo(models.User || User, {
    foreignKey: 'user_id',
    as: 'user',
    onDelete: 'SET NULL',
    onUpdate: 'CASCADE',
  });
};

export default Teacher;