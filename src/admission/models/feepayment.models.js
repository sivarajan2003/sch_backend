//feepayment.models,js
import { sequelize } from '../../db/index.js';
import { DataTypes } from 'sequelize';

const FeePayment = sequelize.define(
  'FeePayment',
  {
    id: {
      type: DataTypes.UUID,
      defaultValue: DataTypes.UUIDV4,
      primaryKey: true,
    },

    admission_id: {
      type: DataTypes.UUID,
      allowNull: false,
    },

    registration_fee: {
      type: DataTypes.DECIMAL(10, 2),
      allowNull: false,
    },

    total_amount: {
      type: DataTypes.DECIMAL(10, 2),
      allowNull: false,
    },

    payment_method: {
      type: DataTypes.ENUM('CARD', 'UPI', 'NET_BANKING', 'CASH'),
      allowNull: false,
    },

    payment_date: {
      type: DataTypes.DATEONLY,
      allowNull: false,
    },

    is_active: {
      type: DataTypes.BOOLEAN,
      defaultValue: true,
    },
  },
  {
    tableName: 'fee_payments',
    timestamps: true,
    paranoid: true,
  }
);

export default FeePayment;
