import * as AdminUserService from '../service/adminuser.service.js';

// Create admin user
export async function createAdminUser(req, res) {
  try {
    const user = await AdminUserService.createAdminUser(req.body, req.user);
    res.status(201).json(user);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
}

// Get all admin users
export async function getAdminUsers(req, res) {
  try {
    const result = await AdminUserService.getAdminUsers(req.query);
    res.json(result);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
}

// Get admin user by ID
export async function getAdminUserById(req, res) {
  try {
    const user = await AdminUserService.getAdminUserById(req.params.id);
    if (!user) return res.status(404).json({ message: 'User not found' });
    res.json(user);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
}

// Login
export async function login(req, res) {
  try {
    const result = await AdminUserService.login(req.body);
    res.json(result);
  } catch (err) {
    res.status(401).json({ message: err.message });
  }
}

// /me
export async function me(req, res) {
  try {
    const user = await AdminUserService.me(req.user);
    res.json(user);
  } catch (err) {
    res.status(401).json({ message: err.message });
  }
}

// Update (PUT)
export async function updateAdminUserById(req, res) {
  try {
    const user = await AdminUserService.updateAdminUserById(req.params.id, req.body, req.user);
    if (!user) return res.status(404).json({ message: 'User not found' });
    res.json(user);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
}

// Delete (soft)
export async function deleteAdminUserById(req, res) {
  try {
    const user = await AdminUserService.deleteAdminUserById(req.params.id, req.user);
    if (!user) return res.status(404).json({ message: 'User not found' });
    res.json(user);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
}

// Patch (partial update)
export async function patchAdminUserById(req, res) {
  try {
    const user = await AdminUserService.patchAdminUserById(req.params.id, req.body, req.user);
    if (!user) return res.status(404).json({ message: 'User not found' });
    res.json(user);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
}

// Restore soft-deleted user
export async function restoreAdminUserById(req, res) {
  try {
    const user = await AdminUserService.restoreAdminUserById(req.params.id, req.user);
    if (!user) return res.status(404).json({ message: 'User not found' });
    res.json(user);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
}

// Refresh token
export async function refreshToken(req, res) {
  try {
    const { refreshToken } = req.body;
    const result = await AdminUserService.refreshToken(refreshToken);
    res.json(result);
  } catch (err) {
    res.status(401).json({ message: err.message });
  }
}

// Logout
export async function logout(req, res) {
  try {
    const success = await AdminUserService.logout(req.user.id);
    res.json({ success });
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
}

// Change password
export async function changePassword(req, res) {
  try {
    const { oldPassword, newPassword } = req.body;
    await AdminUserService.changePassword(req.user.id, oldPassword, newPassword);
    res.json({ success: true });
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
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