import { sequelize } from '../../db/index.js';
import { DataTypes } from 'sequelize';

const PickupEvent = sequelize.define("PickupEvent", {
  id: {
    type: DataTypes.STRING(60),
    primaryKey: true
  },
  routeId: {
    type: DataTypes.STRING(50),
    allowNull: false
  },
  stopName: {
    type: DataTypes.STRING(255),
    allowNull: false
  },
  stopIndex: {
    type: DataTypes.INTEGER,
    allowNull: false,
    defaultValue: 0
  },
  pickupTime: {
    type: DataTypes.DATE,
    allowNull: false,
    defaultValue: DataTypes.NOW
  },
  pickedCount: {
    type: DataTypes.INTEGER,
    allowNull: false,
    defaultValue: 0
  }
}, {
  tableName: "pickup_events",
  timestamps: true
});

export default PickupEvent;
