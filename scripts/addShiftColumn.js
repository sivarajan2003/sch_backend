// addShiftColumn.js – small helper script to add the `shift` column to the `routes` table
// Run with: node backend/scripts/addShiftColumn.js

import { sequelize } from "../src/db/index.js"; // adjust path if your db export is elsewhere

(async () => {
  try {
    await sequelize.query("ALTER TABLE routes ADD COLUMN shift TEXT");
    console.log("✅ shift column added successfully");
  } catch (e) {
    if (e.message && e.message.includes("duplicate column")) {
      console.log("⚠️ shift column already exists – nothing to do");
    } else {
      console.error("❌ Error adding column:", e);
    }
  } finally {
    process.exit();
  }
})();
