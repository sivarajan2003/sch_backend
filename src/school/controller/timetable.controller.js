// timetable.controller.js
import timetableService from '../service/timetable.service.js';
import dto from '../dto/timetable.dto.js';

/**
 * Timetable Controller
 * Expects req.user ({ id, name, email }) from auth middleware
 */

const parseBoolean = (val) => {
  if (typeof val === 'boolean') return val;
  if (!val && val !== false) return false;
  const v = String(val).toLowerCase();
  return v === 'true' || v === '1' || v === 'yes';
};

const createTimetable = async (req, res) => {
  try {
    const payload = req.body;
    if (req.user) {
      payload.created_by = req.user.id;
      payload.created_by_name = req.user.name;
      payload.created_by_email = req.user.email;
    }

    const result = await timetableService.createTimetable(payload);
    return res.status(201).json({ success: true, data: result });
  } catch (err) {
    console.error('createTimetable error', err);
    return res.status(500).json({ success: false, message: err.message || 'Server error' });
  }
};

const updateTimetable = async (req, res) => {
  try {
    const { id } = req.params;
    const payload = req.body;
    if (req.user) {
      payload.updated_by = req.user.id;
      payload.updated_by_name = req.user.name;
      payload.updated_by_email = req.user.email;
    }

    const updated = await timetableService.updateTimetable(id, payload);
    return res.status(200).json({ success: true, data: updated });
  } catch (err) {
    console.error('updateTimetable error', err);
    if (err.message && err.message.toLowerCase().includes('not found')) {
      return res.status(404).json({ success: false, message: err.message });
    }
    return res.status(500).json({ success: false, message: err.message || 'Server error' });
  }
};

const patchTimetable = async (req, res) => {
  return updateTimetable(req, res);
};

const getTimetables = async (req, res) => {
  try {
    const {
      page = 1,
      limit = 10,
      search,
      startDate,
      endDate,
      order,
      includeAudit,
      includeDeleted,
      class_id,
      subject_id,
      teacher_id,
      day_of_week,
      includeRelations,
      is_active,
    } = req.query;

    let filters = {};
    if (req.query.filters) {
      try {
        filters = typeof req.query.filters === 'object' ? req.query.filters : JSON.parse(req.query.filters);
      } catch (e) {
        return res.status(400).json({ success: false, message: 'Invalid filters JSON' });
      }
    }

    let parsedOrder;
    if (order) {
      try {
        parsedOrder = typeof order === 'object' ? order : JSON.parse(order);
      } catch (e) {
        if (typeof order === 'string' && order.includes(':')) {
          const [col, dir] = order.split(':');
          parsedOrder = [[col, dir.toUpperCase()]];
        }
      }
    }

    const opts = {
      page: Number(page) || 1,
      limit: Number(limit) || 10,
      filters,
      search,
      startDate,
      endDate,
      class_id: class_id || undefined,
      subject_id: subject_id || undefined,
      teacher_id: teacher_id || undefined,
      day_of_week: day_of_week || undefined,
      is_active: typeof is_active !== 'undefined' ? parseBoolean(is_active) : undefined,
      includeRelations: parseBoolean(includeRelations),
      includeAudit: parseBoolean(includeAudit),
      includeDeleted: parseBoolean(includeDeleted),
    };
    if (parsedOrder) opts.order = parsedOrder;

    const result = await timetableService.getTimetables(opts);
    return res.status(200).json({ success: true, ...result });
  } catch (err) {
    console.error('getTimetables error', err);
    return res.status(500).json({ success: false, message: err.message || 'Server error' });
  }
};

const getTimetableById = async (req, res) => {
  try {
    const { id } = req.params;
    const includeDeleted = parseBoolean(req.query.includeDeleted);
    const includeAudit = typeof req.query.includeAudit === 'undefined' ? true : parseBoolean(req.query.includeAudit);
    const includeRelations = parseBoolean(req.query.includeRelations);
    const item = await timetableService.getTimetableById(id, { includeDeleted, includeAudit, includeRelations });
    return res.status(200).json({ success: true, data: item });
  } catch (err) {
    console.error('getTimetableById error', err);
    if (err.message && err.message.toLowerCase().includes('not found')) {
      return res.status(404).json({ success: false, message: err.message });
    }
    return res.status(500).json({ success: false, message: err.message || 'Server error' });
  }
};

const deleteTimetable = async (req, res) => {
  try {
    const { id } = req.params;
    const deletedByMeta = {};
    if (req.user) {
      deletedByMeta.deleted_by = req.user.id;
      deletedByMeta.deleted_by_name = req.user.name;
      deletedByMeta.deleted_by_email = req.user.email;
    }
    await timetableService.deleteTimetable(id, deletedByMeta);
    return res.status(200).json({ success: true, message: 'Timetable deleted (soft)' });
  } catch (err) {
    console.error('deleteTimetable error', err);
    if (err.message && err.message.toLowerCase().includes('not found')) {
      return res.status(404).json({ success: false, message: err.message });
    }
    return res.status(500).json({ success: false, message: err.message || 'Server error' });
  }
};

const restoreTimetable = async (req, res) => {
  try {
    const { id } = req.params;
    const restoredByMeta = {};
    if (req.user) {
      restoredByMeta.updated_by = req.user.id;
      restoredByMeta.updated_by_name = req.user.name;
      restoredByMeta.updated_by_email = req.user.email;
    }
    const item = await timetableService.restoreTimetable(id, restoredByMeta);
    return res.status(200).json({ success: true, data: item });
  } catch (err) {
    console.error('restoreTimetable error', err);
    if (err.message && err.message.toLowerCase().includes('not found')) {
      return res.status(404).json({ success: false, message: err.message });
    }
    return res.status(500).json({ success: false, message: err.message || 'Server error' });
  }
};

export default {
  createTimetable,
  updateTimetable,
  patchTimetable,
  getTimetables,
  getTimetableById,
  deleteTimetable,
  restoreTimetable,
};
