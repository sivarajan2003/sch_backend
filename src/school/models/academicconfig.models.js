import { sequelize } from '../../db/index.js';
import { DataTypes } from 'sequelize';

const Academicyearconfig = sequelize.define("AcademicyearConfig", {
    id: {
        type: DataTypes.UUID,
        defaultValue: DataTypes.UUIDV4,
        primaryKey: true,
    },
    academicyear_id: {
        type: DataTypes.UUID,
        allowNull: false,
        references: {
            model: 'academicyears',
            key: 'id',
        },
    },
    class_id: {
        type: DataTypes.UUID,
        allowNull: false,
        references: {
            model: 'classes',
            key: 'id',
        },
    },
    class_teacher_id: {
        type: DataTypes.UUID,
        allowNull: true,
        references: {
            model: 'teachers',
            key: 'id',
        },
    },
    fees: {
        type: DataTypes.FLOAT,
        allowNull: false,
    },
    nameofconfig: {
        type: DataTypes.STRING(100),
        allowNull: false,
    },
    is_active: {
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
        tableName: "academicyear_configs",
        timestamps: true,
        paranoid: true,
        indexes: [
            { fields: ['is_active'] },
            { fields: ['academicyear_id'] },
            { fields: ['class_id'] },
            { fields: ['class_teacher_id'] },
        ],

    });
    Academicyearconfig.associate = (models) => {
        Academicyearconfig.belongsTo(models.Academicyear, {
            foreignKey: 'academicyear_id',
            as: 'academicyear',
        });
        Academicyearconfig.belongsTo(models.Class, {
            foreignKey: 'class_id',
            as: 'class',
        });
        Academicyearconfig.belongsTo(models.Teacher, {
            foreignKey: 'class_teacher_id',
            as: 'classTeacher',
        });
    };

export default Academicyearconfig;

