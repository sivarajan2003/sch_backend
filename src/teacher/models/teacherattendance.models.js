import { sequelize } from '../../db/index.js';
import { DataTypes } from 'sequelize';

const TeacherAttendance = sequelize.define(
  "TeacherAttendance",
  {
    id: {
      type: DataTypes.UUID,
      defaultValue: DataTypes.UUIDV4,
      primaryKey: true,
    },
    teacher_id: {
      type: DataTypes.UUID,
      allowNull: false,
      references: {
        model: 'teachers', // 👈 actual table name (make sure matches Teacher model)
        key: 'id',
      },
    },
    date: {
      type: DataTypes.DATEONLY,
      allowNull: false,
    },
    status: {
      type: DataTypes.ENUM("Present", "Absent", "Late"),
      allowNull: false,
      defaultValue: "Present",
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
  },
  {
    tableName: "teacher_attendances",
    timestamps: true,
    paranoid: true, // enables soft deletes
    indexes: [
      { fields: ['teacher_id'] },
      { fields: ['is_active'] },
    ],
  }
);

// Associations
TeacherAttendance.associate = (models) => {
  TeacherAttendance.belongsTo(models.Teacher, {
    foreignKey: 'teacher_id',
    as: 'teacher',
  });
};

export default TeacherAttendance;
