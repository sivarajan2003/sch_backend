import { sequelize } from '../../db/index.js';
import { DataTypes } from 'sequelize';
import Student from './student.models.js';
import Teacher from '../../teacher/models/teacher.models.js';

const StudentAttendance = sequelize.define('StudentAttendance', {
    id: {
        type: DataTypes.UUID,
        defaultValue: DataTypes.UUIDV4,
        primaryKey: true,
    },
    student_id: {
        type: DataTypes.UUID,
        allowNull: false,
        references: {
            model: Student,
            key: 'id',
        },
    },
    attendanceDate: {
        type: DataTypes.DATEONLY,
        allowNull: false,
    },
    status: {
        type: DataTypes.ENUM('Present', 'Absent', 'Late'),
        defaultValue: 'Present',
    },
    taken_by: {
        type: DataTypes.UUID,
        allowNull: true,
        references: {
            model: Teacher,
            key: 'id',
        },
    },
    is_active: {
        type: DataTypes.BOOLEAN,
        defaultValue: true,
    },

    // 🔹 Audit columns
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
    tableName: "student_attendances",
    timestamps: true,
    paranoid: true,
    indexes: [
        { fields: ['student_id'] },
        { fields: ['taken_by'] },
        { fields: ['is_active'] },
    ],
});

StudentAttendance.belongsTo(Student, { foreignKey: 'student_id', as: 'student' });
StudentAttendance.belongsTo(Teacher, { foreignKey: 'taken_by', as: 'teacher' });

export default StudentAttendance;
