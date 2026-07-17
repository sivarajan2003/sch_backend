// settings.controller.js
import settingsService from '../service/settings.service.js';

/**
 * GET /settings?category=academic
 */
const getSettings = async (req, res) => {
  try {
    const { category } = req.query;
    const result = await settingsService.getSettings(category || null);
    return res.status(200).json({ success: true, data: result.rows, map: result.map });
  } catch (err) {
    console.error('getSettings error', err);
    return res.status(500).json({ success: false, message: err.message });
  }
};

/**
 * PUT /settings  — bulk upsert
 * Body: { "academic_year": "2025-2026", "notif_exam": "true", ... }
 */
const updateSettings = async (req, res) => {
  try {
    const meta = {};
    if (req.user) {
      meta.userId   = req.user.id;
      meta.userName = req.user.name || req.user.username;
    }
    const rows = await settingsService.bulkSetSettings(req.body, meta);
    return res.status(200).json({ success: true, message: 'Settings saved', data: rows });
  } catch (err) {
    console.error('updateSettings error', err);
    return res.status(500).json({ success: false, message: err.message });
  }
};

/**
 * PUT /settings/:key — single key upsert
 */
const setSetting = async (req, res) => {
  try {
    const { key } = req.params;
    const { value } = req.body;
    if (value === undefined) {
      return res.status(400).json({ success: false, message: 'value is required' });
    }
    const meta = {};
    if (req.user) {
      meta.userId   = req.user.id;
      meta.userName = req.user.name || req.user.username;
    }
    const row = await settingsService.setSetting(key, String(value), meta);
    return res.status(200).json({ success: true, data: row });
  } catch (err) {
    console.error('setSetting error', err);
    return res.status(500).json({ success: false, message: err.message });
  }
};

export default { getSettings, updateSettings, setSetting };
