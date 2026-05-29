//interview.models.js
import { sequelize } from '../../db/index.js';
import { DataTypes } from 'sequelize';
import Admission from './admission.models.js';

const Interview = sequelize.define('Interview', {
    id: {
        type: DataTypes.UUID,
        defaultValue: DataTypes.UUIDV4,
        primaryKey: true,
    },
    admission_id: {
        type: DataTypes.UUID,
        allowNull: false,
    },
    interview_date: {
        type: DataTypes.DATE,
        allowNull: false,
    },
    teacher_id: {
        type: DataTypes.UUID,
        allowNull: false,
    },
    location: {
        type: DataTypes.STRING(150),
        allowNull: false,
    },
    status: {
        type: DataTypes.ENUM('Scheduled', 'Completed', 'Cancelled'),
        allowNull: false,
        defaultValue: 'Scheduled',
    },
    documents_status: {
        type: DataTypes.ENUM('Pending', 'Verified', 'Rejected'),
        allowNull: false,
        defaultValue: 'Pending',
    },
    remarks: {
        type: DataTypes.TEXT,
        allowNull: true,
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
    tableName: 'interviews',
    timestamps: true,
    paranoid: true,
    indexes: [
        { fields: ['admission_id'] },
        { fields: ['teacher_id'] },
        { fields: ['status'] },
        { fields: ['is_active'] },

    ],
});

Interview.belongsTo(Admission, { foreignKey: 'admission_id', as: 'admission' });

export default Interview;
