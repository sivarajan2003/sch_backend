// parent.controller.js
import parentService from '../service/parent.service.js';
import dto from '../dto/parent.dto.js';

/**
 * Parent Controller
 * Expects req.user ({ id, name, email }) from auth middleware
 */

const parseBoolean = (val) => {
  if (typeof val === 'boolean') return val;
  if (!val && val !== false) return false;
  const v = String(val).toLowerCase();
  return v === 'true' || v === '1' || v === 'yes';
};

const createParent = async (req, res) => {
  try {
    const payload = req.body;
    if (req.user) {
      payload.created_by = req.user.id;
      payload.created_by_name = req.user.name;
      payload.created_by_email = req.user.email;
    }

    const parent = await parentService.createParent(payload);
    return res.status(201).json({ success: true, data: parent });
  } catch (err) {
    console.error('createParent error', err);
    return res.status(500).json({ success: false, message: err.message || 'Server error' });
  }
};

const updateParent = async (req, res) => {
  try {
    const { id } = req.params;
    const payload = req.body;
    if (req.user) {
      payload.updated_by = req.user.id;
      payload.updated_by_name = req.user.name;
      payload.updated_by_email = req.user.email;
    }

    const updated = await parentService.updateParent(id, payload);
    return res.status(200).json({ success: true, data: updated });
  } catch (err) {
    console.error('updateParent error', err);
    if (err.message && err.message.toLowerCase().includes('not found')) {
      return res.status(404).json({ success: false, message: err.message });
    }
    return res.status(500).json({ success: false, message: err.message || 'Server error' });
  }
};

const patchParent = async (req, res) => {
  // alias for partial updates
  return updateParent(req, res);
};

const getParents = async (req, res) => {
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
      includeAudit: parseBoolean(includeAudit),
      includeDeleted: parseBoolean(includeDeleted),
    };
    if (parsedOrder) opts.order = parsedOrder;

    const result = await parentService.getParents(opts);
    return res.status(200).json({ success: true, ...result });
  } catch (err) {
    console.error('getParents error', err);
    return res.status(500).json({ success: false, message: err.message || 'Server error' });
  }
};

const getParentById = async (req, res) => {
  try {
    const { id } = req.params;
    const includeDeleted = parseBoolean(req.query.includeDeleted);
    const includeAudit = typeof req.query.includeAudit === 'undefined' ? true : parseBoolean(req.query.includeAudit);
    const parent = await parentService.getParentById(id, { includeDeleted, includeAudit });
    return res.status(200).json({ success: true, data: parent });
  } catch (err) {
    console.error('getParentById error', err);
    if (err.message && err.message.toLowerCase().includes('not found')) {
      return res.status(404).json({ success: false, message: err.message });
    }
    return res.status(500).json({ success: false, message: err.message || 'Server error' });
  }
};

const deleteParent = async (req, res) => {
  try {
    const { id } = req.params;
    const deletedByMeta = {};
    if (req.user) {
      deletedByMeta.deleted_by = req.user.id;
      deletedByMeta.deleted_by_name = req.user.name;
      deletedByMeta.deleted_by_email = req.user.email;
    }
    await parentService.deleteParent(id, deletedByMeta);
    return res.status(200).json({ success: true, message: 'Parent deleted (soft)' });
  } catch (err) {
    console.error('deleteParent error', err);
    if (err.message && err.message.toLowerCase().includes('not found')) {
      return res.status(404).json({ success: false, message: err.message });
    }
    return res.status(500).json({ success: false, message: err.message || 'Server error' });
  }
};

const restoreParent = async (req, res) => {
  try {
    const { id } = req.params;
    const restoredByMeta = {};
    if (req.user) {
      restoredByMeta.updated_by = req.user.id;
      restoredByMeta.updated_by_name = req.user.name;
      restoredByMeta.updated_by_email = req.user.email;
    }
    const parent = await parentService.restoreParent(id, restoredByMeta);
    return res.status(200).json({ success: true, data: parent });
  } catch (err) {
    console.error('restoreParent error', err);
    if (err.message && err.message.toLowerCase().includes('not found')) {
      return res.status(404).json({ success: false, message: err.message });
    }
    return res.status(500).json({ success: false, message: err.message || 'Server error' });
  }
};

export default {
  createParent,
  updateParent,
  patchParent,
  getParents,
  getParentById,
  deleteParent,
  restoreParent,
};
