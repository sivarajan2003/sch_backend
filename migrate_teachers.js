import dotenv from 'dotenv';
dotenv.config();
import { sequelize } from './src/db/index.js';

const cols = [
  `ALTER TABLE teachers ADD COLUMN IF NOT EXISTS address TEXT`,
  `ALTER TABLE teachers ADD COLUMN IF NOT EXISTS date_of_birth DATE`,
  `ALTER TABLE teachers ADD COLUMN IF NOT EXISTS gender ENUM('Male','Female','Other')`,
  `ALTER TABLE teachers ADD COLUMN IF NOT EXISTS number VARCHAR(15)`,
  `ALTER TABLE teachers ADD COLUMN IF NOT EXISTS qualification VARCHAR(255)`,
  `ALTER TABLE teachers ADD COLUMN IF NOT EXISTS hire_date DATETIME`,
  `ALTER TABLE teachers ADD COLUMN IF NOT EXISTS subjects JSON`,
  `ALTER TABLE teachers ADD COLUMN IF NOT EXISTS desgination ENUM('Head Master','Assistant Teacher','Teacher')`,
  `ALTER TABLE teachers ADD COLUMN IF NOT EXISTS salary FLOAT`,
  `ALTER TABLE teachers ADD COLUMN IF NOT EXISTS is_active TINYINT(1) DEFAULT 1`,
  `ALTER TABLE teachers ADD COLUMN IF NOT EXISTS deletedAt DATETIME`,
  `ALTER TABLE teachers ADD COLUMN IF NOT EXISTS user_id CHAR(36)`,
  `ALTER TABLE teachers ADD COLUMN IF NOT EXISTS created_by CHAR(36)`,
  `ALTER TABLE teachers ADD COLUMN IF NOT EXISTS updated_by CHAR(36)`,
  `ALTER TABLE teachers ADD COLUMN IF NOT EXISTS deleted_by CHAR(36)`,
  `ALTER TABLE teachers ADD COLUMN IF NOT EXISTS created_by_name VARCHAR(255)`,
  `ALTER TABLE teachers ADD COLUMN IF NOT EXISTS updated_by_name VARCHAR(255)`,
  `ALTER TABLE teachers ADD COLUMN IF NOT EXISTS deleted_by_name VARCHAR(255)`,
  `ALTER TABLE teachers ADD COLUMN IF NOT EXISTS created_by_email VARCHAR(255)`,
  `ALTER TABLE teachers ADD COLUMN IF NOT EXISTS updated_by_email VARCHAR(255)`,
  `ALTER TABLE teachers ADD COLUMN IF NOT EXISTS deleted_by_email VARCHAR(255)`,
];

for (const sql of cols) {
  try {
    await sequelize.query(sql);
    console.log('OK:', sql.substring(30, 70));
  } catch (e) {
    if (e.message.includes('Duplicate column')) {
      console.log('SKIP:', sql.substring(30, 70));
    } else {
      console.error('ERR:', e.message);
    }
  }
}
console.log('Done.');
process.exit(0);
