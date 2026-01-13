import bcrypt from 'bcryptjs';
import User from '../adminuser/models/adminuser.model.js';

const DEFAULT_ADMIN = {
  role: 'Super Admin',
  username: 'Super Admin',
  email: 'admin@gmail.com',
  password: 'admin@123',
  phone: '1234567890',
};

export async function initAdminUser() {
  try {
    const count = await User.count();
    if (count === 0) {
      const hashed = await bcrypt.hash(DEFAULT_ADMIN.password, 10);
      await User.create({
        ...DEFAULT_ADMIN,
        password: hashed,
      });
      console.log('✅ Default Super Admin created:', DEFAULT_ADMIN.email);
    } else {
      console.log('ℹ️ Admin user(s) already exist, skipping seed.');
    }
  } catch (err) {
    console.error('❌ Failed to initialize Super Admin:', err);
  }
}
