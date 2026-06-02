import { sequelize } from '../src/db/index.js';

(async () => {
  try {
    await sequelize.query(`ALTER TABLE transport_routes ADD COLUMN shift VARCHAR(20) NOT NULL DEFAULT 'Morning'`);
    console.log('✅ shift column added to transport_routes table');
  } catch (e) {
    if (e.parent && e.parent.code === 'ER_DUP_FIELDNAME') {
      console.log('⚠️ shift column already exists in transport_routes');
    } else {
      console.error('❌ Error adding shift column to transport_routes:', e);
    }
  } finally {
    process.exit();
  }
})();
