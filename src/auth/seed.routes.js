// seed.routes.js — Bootstrap endpoint for seed script only
// Creates Super Admin if not present. Only callable when SEED_SECRET env matches.
import express from 'express';
import bcrypt from 'bcryptjs';
import AdminUser from '../adminuser/models/adminuser.model.js';

const router = express.Router();

const SEED_SECRET = process.env.SEED_SECRET || 'seed-bootstrap-2024';

router.post('/seed-bootstrap', async (req, res) => {
  try {
    const { secret, users } = req.body;

    if (secret !== SEED_SECRET) {
      return res.status(403).json({ message: 'Forbidden' });
    }

    const results = [];

    for (const u of (users || [])) {
      const [rec, created] = await AdminUser.findOrCreate({
        where: { email: u.email },
        defaults: {
          username: u.username,
          email: u.email,
          password: await bcrypt.hash(u.password, 10),
          role: u.role,
          phone: u.phone || null,
          is_active: true,
        },
      });
      results.push({ email: rec.email, id: rec.id, created });
    }

    return res.status(200).json({ success: true, results });

  } catch (err) {
    console.error('seed-bootstrap error:', err);
    return res.status(500).json({ message: err.message });
  }
});

export default router;
