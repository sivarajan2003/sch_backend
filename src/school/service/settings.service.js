// settings.service.js
import Settings from '../models/settings.model.js';

const DEFAULTS = [
  { key: 'academic_year',          value: '2024 - 2025', category: 'academic',      label: 'Current Academic Year' },
  { key: 'academic_year_status',   value: 'Active',       category: 'academic',      label: 'Academic Year Status' },
  { key: 'school_name',            value: 'Atelier School',category: 'general',      label: 'School Name' },
  { key: 'school_address',         value: '',             category: 'general',       label: 'School Address' },
  { key: 'school_phone',           value: '',             category: 'general',       label: 'School Phone' },
  { key: 'school_email',           value: '',             category: 'general',       label: 'School Email' },
  { key: 'notif_exam',             value: 'true',         category: 'notifications', label: 'Exam Notifications' },
  { key: 'notif_fee_payment',      value: 'true',         category: 'notifications', label: 'Fee Payment Alerts' },
  { key: 'notif_attendance',       value: 'true',         category: 'notifications', label: 'Attendance Alerts' },
  { key: 'notif_system_updates',   value: 'false',        category: 'notifications', label: 'System Updates' },
];

/**
 * Get all settings (or by category).
 * Returns an object keyed by setting key for easy lookup.
 */
const getSettings = async (category = null) => {
  const where = category ? { category } : {};
  const rows = await Settings.findAll({ where, order: [['category', 'ASC'], ['key', 'ASC']] });

  // Return as key→value map
  const map = {};
  rows.forEach(r => { map[r.key] = r.value; });
  return { rows, map };
};

/**
 * Upsert a single setting.
 */
const setSetting = async (key, value, meta = {}) => {
  const [row, created] = await Settings.findOrCreate({
    where: { key },
    defaults: { key, value, updated_by: meta.userId, updated_by_name: meta.userName },
  });
  if (!created) {
    await row.update({ value, updated_by: meta.userId || null, updated_by_name: meta.userName || null });
  }
  return row;
};

/**
 * Bulk upsert — accepts { key: value, ... } object.
 */
const bulkSetSettings = async (settingsObj, meta = {}) => {
  const results = [];
  for (const [key, value] of Object.entries(settingsObj)) {
    const row = await setSetting(key, String(value), meta);
    results.push(row);
  }
  return results;
};

/**
 * Seed defaults — only inserts rows that don't yet exist.
 */
const seedDefaults = async () => {
  for (const d of DEFAULTS) {
    await Settings.findOrCreate({ where: { key: d.key }, defaults: d });
  }
};

export default { getSettings, setSetting, bulkSetSettings, seedDefaults };
