import { sequelize } from '../src/db/index.js';

(async () => {
  try {
    await sequelize.query(`
      CREATE TABLE IF NOT EXISTS pickup_events (
        id VARCHAR(100) PRIMARY KEY,
        routeId VARCHAR(50) NOT NULL,
        stopName VARCHAR(255) NOT NULL,
        stopIndex INT NOT NULL DEFAULT 0,
        pickupTime DATETIME NOT NULL,
        pickedCount INT NOT NULL DEFAULT 0,
        createdAt DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
        updatedAt DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
      )
    `);
    console.log('✅ pickup_events table created (or already exists)');
  } catch (e) {
    console.error('❌ Error creating pickup_events table:', e);
  } finally {
    process.exit();
  }
})();
