import { sequelize } from '../../db/index.js';
import { DataTypes } from 'sequelize';
import Parent from '../../parent/models/parent.models.js';
import Academicyearconfig from '../../school/models/academicconfig.models.js';

const Student = sequelize.define("Student", {
    id: {
    type: DataTypes.UUID,
    defaultValue: DataTypes.UUIDV4,
    primaryKey: true,
  },
  name: {
    type: DataTypes.STRING(100),
    allowNull: false,
  },
  age: {
    type: DataTypes.INTEGER,
    allowNull: false,
  },
  gender: {
    type: DataTypes.ENUM("Male", "Female", "Other"),
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
  parent_id: {
    type: DataTypes.UUID,
    allowNull: true,
    references: { model: 'parents', key: 'id' }, // safe string ref
  },

  current_academic_config_id: {
    type: DataTypes.UUID,
    allowNull: true,
    references: { model: 'academicyear_configs', key: 'id' },
  },
  yearofjoining: {
    type: DataTypes.INTEGER,
    allowNull: false,
  },
  roll_number: {
    type: DataTypes.INTEGER,
    allowNull: false,
  },
  blood_group: {
    type: DataTypes.ENUM("A+", "A-", "B+", "B-", "AB+", "AB-", "O+", "O-"),
    allowNull: false,
  },
  admission_number: {
    type: DataTypes.STRING(20),
    allowNull: false,
    unique: true,
  },
  admission_date: {
    type: DataTypes.DATEONLY,
    allowNull: false,
  },
  profile_image: {
    type: DataTypes.STRING,
    allowNull: true,
  },
  academic_year: {
    type: DataTypes.STRING,
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
    tableName: "students",
    timestamps: true,
    paranoid: true,
    indexes: [
    { fields: ['parent_id'] },
    { fields: ['current_academic_config_id'] },
    { fields: ['is_active'] },
  ],
  });
  
  Student.associate = (models) => {
  Student.belongsTo(models.Parent || Parent, {
    foreignKey: 'parent_id',
    as: 'Parent',
    onDelete: 'SET NULL',
    onUpdate: 'CASCADE',
  });
  Student.belongsTo(models.AcademicyearConfig || Academicyearconfig, {
    foreignKey: 'current_academic_config_id',
    as: 'AcademicConfig',
    onDelete: 'SET NULL',
    onUpdate: 'CASCADE',
  });
};

export default Student;

