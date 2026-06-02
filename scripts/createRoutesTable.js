// createRoutesTable.js
/**
 * Utility script to ensure the `routes` table exists with the correct schema.
 * Run it before adding the `shift` column or before using the Transport API.
 */

import { sequelize } from '../src/db/index.js'; // Adjust path if needed

(async () => {
  try {
    // Create the table if it does not exist
    await sequelize.query(`
      CREATE TABLE IF NOT EXISTS routes (
        id VARCHAR(50) PRIMARY KEY,
        name VARCHAR(255) NOT NULL,
        busId VARCHAR(50) NOT NULL,
        stops TEXT NOT NULL,
        currentStopIndex INT,
        status VARCHAR(20),
        date DATETIME,
        shift TEXT
      )
    `);
    console.log('✅ routes table ensured (created if missing).');
  } catch (e) {
    console.error('❌ Error creating routes table:', e);
  } finally {
    process.exit();
  }
})();
