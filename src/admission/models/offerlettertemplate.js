import { sequelize } from '../../db/index.js';
import { DataTypes } from 'sequelize';

const OfferLetterTemplate = sequelize.define('OfferLetterTemplate', {
    id: {
        type: DataTypes.UUID,
        defaultValue: DataTypes.UUIDV4,
        primaryKey: true,
    },
    header_title: {
        type: DataTypes.STRING,
        allowNull: false,
        defaultValue: "ATELIER SCHOOL"
    },
    header_subtitle: {
        type: DataTypes.STRING,
        allowNull: true,
        defaultValue: "Excellence in Education"
    },
    header_logo: {
        type: DataTypes.TEXT,
        allowNull: true
    },
    footer_text: {
        type: DataTypes.TEXT,
        allowNull: true,
        defaultValue: "123 School Lane, Education City\nContact: info@atelier.com | +1 234 567 890"
    },
    watermark_text: {
        type: DataTypes.STRING,
        allowNull: true,
        defaultValue: "OFFICIAL OFFER"
    },
    watermark_image: {
        type: DataTypes.TEXT,
        allowNull: true
    },
    watermark_opacity: {
        type: DataTypes.INTEGER,
        defaultValue: 10
    },
    show_watermark: {
        type: DataTypes.BOOLEAN,
        defaultValue: true
    },
    principal_signature: {
        type: DataTypes.TEXT,
        allowNull: true
    },
    school_seal: {
        type: DataTypes.TEXT,
        allowNull: true
    },
    is_active: {
        type: DataTypes.BOOLEAN,
        defaultValue: true,
    }
}, {
    tableName: 'offer_letter_templates',
    timestamps: true,
    paranoid: true,
});

export default OfferLetterTemplate;
