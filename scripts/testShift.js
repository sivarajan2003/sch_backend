// testShift.js – quick verification of the `shift` column in the `routes` table

import { sequelize } from '../src/db/index.js'; // adjust relative path if needed

(async () => {
  try {
    // Insert a sample route (id must be unique)
    await sequelize.query(`
      INSERT INTO routes (id, name, busId, stops, currentStopIndex, status, date, shift)
      VALUES ('RTEST', 'Test Route', 'BTEST', '["StopA","StopB"]', -1, 'Active', NOW(), 'Evening')
    `);
    console.log('✅ Sample route inserted');

    // Retrieve the inserted route
    const [rows] = await sequelize.query(`SELECT * FROM routes WHERE id = 'RTEST'`);
    console.log('🔎 Fetched row:', rows[0]);
  } catch (e) {
    console.error('❌ Error during test script:', e);
  } finally {
    process.exit();
  }
})();
