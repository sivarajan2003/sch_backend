//admission.models.js
import { sequelize } from '../../db/index.js';
import { DataTypes } from 'sequelize';

const Admission = sequelize.define('Admission', {
  id: {
    type: DataTypes.UUID,
    defaultValue: DataTypes.UUIDV4,
    primaryKey: true,
  },
  student_name: {
    type: DataTypes.STRING(100),
    allowNull: false,
  },
  date_of_birth: {
    type: DataTypes.DATEONLY,
    allowNull: false,
  },
  gender: {
    type: DataTypes.ENUM('Male', 'Female', 'Other'),
    allowNull: false,
  },
  address: {
    type: DataTypes.TEXT,
    allowNull: false,
  },
  addmission_number: {
    type: DataTypes.STRING(50),
    allowNull: false,
    unique: true,
  },
  class_applied_id: {
    type: DataTypes.UUID,
    allowNull: false,
  },
  parent_name: {
    type: DataTypes.STRING(100),
    allowNull: false,
  },
  parent_number: {
    type: DataTypes.STRING(15),
    allowNull: false,
  },
  parent_email: {
    type: DataTypes.STRING(100),
    allowNull: false,
  },
  quota_category: {
    type: DataTypes.ENUM('General', 'management', 'sports', 'minority'),
    allowNull: false,
  },
  academic_achievements: {
    type: DataTypes.TEXT,
    allowNull: true,
  },
  previous_school: {
    type: DataTypes.STRING(150),
    allowNull: true,
  },
  last_year_grade: {
    type: DataTypes.STRING(50),
    allowNull: true,
  },
  year_of_passing: {
    type: DataTypes.INTEGER,
    allowNull: true,
  },
  reason_for_transfer: {
    type: DataTypes.TEXT,
    allowNull: true,
  },
  birth_certificate: {
    type: DataTypes.STRING,
    allowNull: true,
  },
  birth_certificate_status: {
    type: DataTypes.ENUM('Pending', 'Verified', 'Rejected', 'want to reupload', 'not uploaded'),
    allowNull: false,
    defaultValue: 'Pending',
  },
  birth_certificate_remarks: {
    type: DataTypes.TEXT,
    allowNull: true,
  },
  tc_certificate: {
    type: DataTypes.STRING,
    allowNull: true,
  },
  tc_certificate_status: {
    type: DataTypes.ENUM('Pending', 'Verified', 'Rejected', 'want to reupload', 'not uploaded'),
    allowNull: false,
    defaultValue: 'Pending',
  },
  tc_certificate_remarks: {
    type: DataTypes.TEXT,
    allowNull: true,
  },
  passport_size_photo: {
    type: DataTypes.STRING,
    allowNull: true,
  },
  passport_size_photo_status: {
    type: DataTypes.ENUM('Pending', 'Verified', 'Rejected', 'want to reupload', 'not uploaded'),
    allowNull: false,
    defaultValue: 'Pending',
  },
  passport_size_photo_remarks: {
    type: DataTypes.TEXT,
    allowNull: true,
  },
  address_proof: {
    type: DataTypes.STRING,
    allowNull: true,
  },
  address_proof_status: {
    type: DataTypes.ENUM('Pending', 'Verified', 'Rejected', 'want to reupload', 'not uploaded'),
    allowNull: false,
    defaultValue: 'Pending',
  },
  address_proof_remarks: {
    type: DataTypes.TEXT,
    allowNull: true,
  },
  admission_status: {
    type: DataTypes.ENUM('Applied', 'Pending', 'Approved', 'Rejected', 'Verifying Documents', 'Interview Scheduled', 'Interview Done', 'Offer Sent', 'Offer Accepted', 'Enrolled'),
    defaultValue: 'Applied',
  },
  
  payment_status: {
        type: DataTypes.ENUM('Pending', 'Completed', 'Failed'),
        allowNull: false,
        defaultValue: 'Pending',
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
  tableName: 'admissions',
  timestamps: true,
  paranoid: true,
});
export default Admission;
