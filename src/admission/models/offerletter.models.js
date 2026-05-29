import { sequelize } from '../../db/index.js';
import { DataTypes } from 'sequelize';

const OfferLetter = sequelize.define('OfferLetter', {
    id: {
        type: DataTypes.UUID,
        defaultValue: DataTypes.UUIDV4,
        primaryKey: true,
    },
    admission_id: {
        type: DataTypes.UUID,
        allowNull: false,
    },
    letter_date: {
        type: DataTypes.DATE,
        allowNull: false,
    },
    validity_date: {
        type: DataTypes.DATE,
        allowNull: false,
    },
    status: {
        type: DataTypes.ENUM('Generated', 'Accepted', 'Declined'),
        allowNull: false,
        defaultValue: 'Generated',
    },
    payment_status: {
        type: DataTypes.ENUM('Pending', 'Completed', 'Failed'),
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
    tableName: 'offer_letters',
    timestamps: true,
    paranoid: true,
    indexes: [
        { fields: ['admission_id'] },
        { fields: ['status'] },
    ],
});

export default OfferLetter;
