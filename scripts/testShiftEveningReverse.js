// testShiftEveningReverse.js – verify `shift` = 'Evening' with reversed stops order

import { sequelize } from '../src/db/index.js'; // adjust path if needed

(async () => {
  try {
    // Insert a sample route with stops in reverse order
    await sequelize.query(`
      INSERT INTO routes (id, name, busId, stops, currentStopIndex, status, date, shift)
      VALUES ('RREV', 'Reversed Stops Route', 'BTEST', '["StopB","StopA"]', -1, 'Active', NOW(), 'Evening')
    `);
    console.log('✅ Sample route with reversed stops inserted');

    // Retrieve the inserted route
    const [rows] = await sequelize.query(`SELECT * FROM routes WHERE id = 'RREV'`);
    console.log('🔎 Fetched row:', rows[0]);
  } catch (e) {
    console.error('❌ Error during reverse stops test script:', e);
  } finally {
    process.exit();
  }
})();
