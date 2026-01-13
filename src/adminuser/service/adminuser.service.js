import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import { Op } from 'sequelize';
import User from '../models/adminuser.model.js';
import { sequelize } from '../../db/index.js';

const JWT_SECRET = process.env.JWT_SECRET || 'your_jwt_secret_key';
const ACCESS_TOKEN_EXPIRES_IN = process.env.ACCESS_TOKEN_EXPIRES_IN || '7d';
const REFRESH_TOKEN_EXPIRES_IN = process.env.REFRESH_TOKEN_EXPIRES_IN || '7d';
const BCRYPT_SALT_ROUNDS = parseInt(process.env.BCRYPT_SALT_ROUNDS || '10', 10);

// Helper: generate tokens
function generateAccessToken(payload) {
  return jwt.sign(payload, JWT_SECRET, { expiresIn: ACCESS_TOKEN_EXPIRES_IN });
}

function generateRefreshToken(payload) {
  return jwt.sign(payload, JWT_SECRET, { expiresIn: REFRESH_TOKEN_EXPIRES_IN });
}

// Create admin user
export async function createAdminUser(data, meta = {}) {
  const t = await sequelize.transaction();
  try {
    const { password } = data;
    if (!password) throw new Error('Password is required');

    const hashed = await bcrypt.hash(password, BCRYPT_SALT_ROUNDS);
    const user = await User.create(
      {
        ...data,
        password: hashed,
        created_by: meta.userId || null,
        created_by_name: meta.userName || null,
        created_by_email: meta.userEmail || null,
      },
      { transaction: t }
    );

    await t.commit();
    // Do not return password hash in response
    const safe = user.toJSON();
    delete safe.password;
    return safe;
  } catch (err) {
    await t.rollback();
    throw err;
  }
}

// List/get admin users with filters, pagination
export async function getAdminUsers(opts = {}) {
  const {
    page = 1,
    limit = 20,
    search,
    role,
    is_active,
    order = [['createdAt', 'DESC']],
  } = opts;

  const where = {};
  if (role) where.role = role;
  if (typeof is_active !== 'undefined') where.is_active = is_active;
  if (search) {
    where[Op.or] = [
      { username: { [Op.iLike]: `%${search}%` } },
      { email: { [Op.iLike]: `%${search}%` } },
      { phone: { [Op.iLike]: `%${search}%` } },
    ];
  }

  const offset = (page - 1) * limit;

  const { rows, count } = await User.findAndCountAll({
    where,
    limit,
    offset,
    order,
    attributes: { exclude: ['password'] },
  });

  return {
    data: rows,
    meta: {
      total: count,
      page: Number(page),
      limit: Number(limit),
      pages: Math.ceil(count / limit) || 1,
    },
  };
}

// Get by id
export async function getAdminUserById(id) {
  const user = await User.findByPk(id, { attributes: { exclude: ['password'] } });
  if (!user) return null;
  return user;
}

// Login — returns { accessToken, refreshToken, user }
export async function login({ email, password }, ipMeta = {}) {
  const user = await User.findOne({ where: { email } });
  if (!user) throw new Error('Invalid credentials');

  const match = await bcrypt.compare(password, user.password);
  if (!match) throw new Error('Invalid credentials');

  if (!user.is_active) throw new Error('User account is inactive');

  const payload = {
    id: user.id,
    email: user.email,
    role: user.role,
  };

  const accessToken = generateAccessToken(payload);
  const refreshToken = generateRefreshToken(payload);

  // store refresh token in DB (so we can invalidate on logout)
  user.token = refreshToken;
  await user.save();

  const safe = user.toJSON();
  delete safe.password;

  return { accessToken, refreshToken, user: safe };
}

// /me — get user from token payload (expects req.user filled by middleware)
export async function me(userPayload) {
  if (!userPayload || !userPayload.id) throw new Error('Invalid token payload');
  const user = await User.findByPk(userPayload.id, { attributes: { exclude: ['password'] } });
  if (!user) throw new Error('User not found');
  return user;
}

// PUT by id — replace user fields (except password/token)
export async function updateAdminUserById(id, data, meta = {}) {
  const t = await sequelize.transaction();
  try {
    const user = await User.findByPk(id, { transaction: t });
    if (!user) {
      await t.rollback();
      return null;
    }

    // Prevent accidental overwrite of password/token
    const { password, token, id: _id, createdAt, updatedAt, ...updatable } = data;

    // track who updated
    updatable.updated_by = meta.userId || user.updated_by;
    updatable.updated_by_name = meta.userName || user.updated_by_name;
    updatable.updated_by_email = meta.userEmail || user.updated_by_email;

    await user.update(updatable, { transaction: t });
    await t.commit();

    const safe = user.toJSON();
    delete safe.password;
    return safe;
  } catch (err) {
    await t.rollback();
    throw err;
  }
}

// Soft delete by id — set is_active = false and fill deleted_by fields
export async function deleteAdminUserById(id, meta = {}) {
  const t = await sequelize.transaction();
  try {
    const user = await User.findByPk(id, { transaction: t });
    if (!user) {
      await t.rollback();
      return null;
    }

    await user.update(
      {
        is_active: false,
        deleted_by: meta.userId || null,
        deleted_by_name: meta.userName || null,
        deleted_by_email: meta.userEmail || null,
      },
      { transaction: t }
    );

    await t.commit();
    const safe = user.toJSON();
    delete safe.password;
    return safe;
  } catch (err) {
    await t.rollback();
    throw err;
  }
}

// PATCH by id — partial update (same as update but allows partial fields)
export async function patchAdminUserById(id, data, meta = {}) {
  // reuse update logic
  return updateAdminUserById(id, data, meta);
}

// Restore (undo soft delete)
export async function restoreAdminUserById(id, meta = {}) {
  const t = await sequelize.transaction();
  try {
    const user = await User.findByPk(id, { transaction: t });
    if (!user) {
      await t.rollback();
      return null;
    }

    await user.update(
      {
        is_active: true,
        deleted_by: null,
        deleted_by_name: null,
        deleted_by_email: null,
        updated_by: meta.userId || user.updated_by,
        updated_by_name: meta.userName || user.updated_by_name,
        updated_by_email: meta.userEmail || user.updated_by_email,
      },
      { transaction: t }
    );

    await t.commit();
    const safe = user.toJSON();
    delete safe.password;
    return safe;
  } catch (err) {
    await t.rollback();
    throw err;
  }
}

// Refresh token — exchange refresh token for new access token (and optionally a new refresh token)
export async function refreshToken(oldRefreshToken) {
  if (!oldRefreshToken) throw new Error('Missing refresh token');

  let decoded;
  try {
    decoded = jwt.verify(oldRefreshToken, JWT_SECRET);
  } catch (err) {
    throw new Error('Invalid or expired refresh token');
  }

  const user = await User.findByPk(decoded.id);
  if (!user) throw new Error('User not found');
  if (!user.token || user.token !== oldRefreshToken) throw new Error('Refresh token mismatch');

  const payload = { id: user.id, email: user.email, role: user.role };
  const accessToken = generateAccessToken(payload);
  const newRefreshToken = generateRefreshToken(payload);

  // rotate refresh tokens
  user.token = newRefreshToken;
  await user.save();

  return { accessToken, refreshToken: newRefreshToken };
}

// Logout — invalidate refresh token stored in DB
export async function logout(userId) {
  const user = await User.findByPk(userId);
  if (!user) return null;
  user.token = null;
  await user.save();
  return true;
}

// Change password — verify old password (or require admin override) then set new hashed password
export async function changePassword(userId, oldPassword, newPassword, skipOldPasswordCheck = false) {
  const user = await User.findByPk(userId);
  if (!user) throw new Error('User not found');

  if (!skipOldPasswordCheck) {
    const ok = await bcrypt.compare(oldPassword || '', user.password);
    if (!ok) throw new Error('Old password is incorrect');
  }

  const hashed = await bcrypt.hash(newPassword, BCRYPT_SALT_ROUNDS);
  user.password = hashed;
  // invalidate refresh tokens after password change
  user.token = null;
  await user.save();
  return true;
}

export default {
  createAdminUser,
  getAdminUsers,
  getAdminUserById,
  login,
  me,
  updateAdminUserById,
  deleteAdminUserById,
  patchAdminUserById,
  restoreAdminUserById,
  refreshToken,
  logout,
  changePassword,
};
