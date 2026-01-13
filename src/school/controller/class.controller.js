// class.controller.js
import classService from '../service/class.service.js';
import dto from '../dto/class.dto.js';

const parseBoolean = (val) => {
  if (typeof val === 'boolean') return val;
  if (!val && val !== false) return false;
  const v = String(val).toLowerCase();
  return v === 'true' || v === '1' || v === 'yes';
};

const createClass = async (req, res) => {
  try {
    const payload = req.body;
    if (req.user) {
      payload.created_by = req.user.id;
      payload.created_by_name = req.user.name;
      payload.created_by_email = req.user.email;
    }

    const klass = await classService.createClass(payload);
    return res.status(201).json({ success: true, data: klass });
  } catch (err) {
    console.error('createClass error', err);
    return res.status(500).json({ success: false, message: err.message || 'Server error' });
  }
};

const updateClass = async (req, res) => {
  try {
    const { id } = req.params;
    const payload = req.body;
    if (req.user) {
      payload.updated_by = req.user.id;
      payload.updated_by_name = req.user.name;
      payload.updated_by_email = req.user.email;
    }

    const updated = await classService.updateClass(id, payload);
    return res.status(200).json({ success: true, data: updated });
  } catch (err) {
    console.error('updateClass error', err);
    if (err.message && err.message.toLowerCase().includes('not found')) {
      return res.status(404).json({ success: false, message: err.message });
    }
    return res.status(500).json({ success: false, message: err.message || 'Server error' });
  }
};

const patchClass = async (req, res) => {
  // alias for partial updates
  return updateClass(req, res);
};

const getClasses = async (req, res) => {
  try {
    const {
      page = 1,
      limit = 10,
      search,
      section,
      order,
      includeAudit,
      includeDeleted,
      includeStudents,
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
      section: section || undefined,
      is_active: typeof is_active !== 'undefined' ? parseBoolean(is_active) : undefined,
      includeAudit: parseBoolean(includeAudit),
      includeDeleted: parseBoolean(includeDeleted),
      includeStudents: parseBoolean(includeStudents),
    };
    if (parsedOrder) opts.order = parsedOrder;

    const result = await classService.getClasses(opts);
    return res.status(200).json({ success: true, ...result });
  } catch (err) {
    console.error('getClasses error', err);
    return res.status(500).json({ success: false, message: err.message || 'Server error' });
  }
};

const getClassById = async (req, res) => {
  try {
    const { id } = req.params;
    const includeDeleted = parseBoolean(req.query.includeDeleted);
    const includeAudit = typeof req.query.includeAudit === 'undefined' ? true : parseBoolean(req.query.includeAudit);
    const includeStudents = parseBoolean(req.query.includeStudents);
    const klass = await classService.getClassById(id, { includeDeleted, includeAudit, includeStudents });
    return res.status(200).json({ success: true, data: klass });
  } catch (err) {
    console.error('getClassById error', err);
    if (err.message && err.message.toLowerCase().includes('not found')) {
      return res.status(404).json({ success: false, message: err.message });
    }
    return res.status(500).json({ success: false, message: err.message || 'Server error' });
  }
};

const deleteClass = async (req, res) => {
  try {
    const { id } = req.params;
    const deletedByMeta = {};
    if (req.user) {
      deletedByMeta.deleted_by = req.user.id;
      deletedByMeta.deleted_by_name = req.user.name;
      deletedByMeta.deleted_by_email = req.user.email;
    }
    await classService.deleteClass(id, deletedByMeta);
    return res.status(200).json({ success: true, message: 'Class deleted (soft)' });
  } catch (err) {
    console.error('deleteClass error', err);
    if (err.message && err.message.toLowerCase().includes('not found')) {
      return res.status(404).json({ success: false, message: err.message });
    }
    return res.status(500).json({ success: false, message: err.message || 'Server error' });
  }
};

const restoreClass = async (req, res) => {
  try {
    const { id } = req.params;
    const restoredByMeta = {};
    if (req.user) {
      restoredByMeta.updated_by = req.user.id;
      restoredByMeta.updated_by_name = req.user.name;
      restoredByMeta.updated_by_email = req.user.email;
    }
    const klass = await classService.restoreClass(id, restoredByMeta);
    return res.status(200).json({ success: true, data: klass });
  } catch (err) {
    console.error('restoreClass error', err);
    if (err.message && err.message.toLowerCase().includes('not found')) {
      return res.status(404).json({ success: false, message: err.message });
    }
    return res.status(500).json({ success: false, message: err.message || 'Server error' });
  }
};

export default {
  createClass,
  updateClass,
  patchClass,
  getClasses,
  getClassById,
  deleteClass,
  restoreClass,
};
