import { sequelize } from '../src/db/index.js';

(async () => {
  try {
    await sequelize.query(`ALTER TABLE routes ADD COLUMN shift VARCHAR(20)`);
    console.log('✅ shift column added to MySQL routes table');
  } catch (e) {
    if (e.parent && e.parent.code === 'ER_DUP_FIELDNAME') {
      console.log('⚠️ shift column already exists');
    } else {
      console.error('❌ Error adding shift column:', e);
    }
  } finally {
    process.exit();
  }
})();
