// subject.controller.js
import subjectService from '../service/subject.service.js';
import dto from '../dto/subject.dto.js';

/**
 * Subject Controller
 * Expects req.user ({ id, name, email }) from auth middleware
 */

const parseBoolean = (val) => {
  if (typeof val === 'boolean') return val;
  if (!val && val !== false) return false;
  const v = String(val).toLowerCase();
  return v === 'true' || v === '1' || v === 'yes';
};

const createSubject = async (req, res) => {
  try {
    const payload = req.body;
    if (req.user) {
      payload.created_by = req.user.id;
      payload.created_by_name = req.user.name;
      payload.created_by_email = req.user.email;
    }

    const subject = await subjectService.createSubject(payload);
    return res.status(201).json({ success: true, data: subject });
  } catch (err) {
    console.error('createSubject error', err);
    return res.status(500).json({ success: false, message: err.message || 'Server error' });
  }
};

const updateSubject = async (req, res) => {
  try {
    const { id } = req.params;
    const payload = req.body;
    if (req.user) {
      payload.updated_by = req.user.id;
      payload.updated_by_name = req.user.name;
      payload.updated_by_email = req.user.email;
    }

    const updated = await subjectService.updateSubject(id, payload);
    return res.status(200).json({ success: true, data: updated });
  } catch (err) {
    console.error('updateSubject error', err);
    if (err.message && err.message.toLowerCase().includes('not found')) {
      return res.status(404).json({ success: false, message: err.message });
    }
    return res.status(500).json({ success: false, message: err.message || 'Server error' });
  }
};

const patchSubject = async (req, res) => {
  // alias for partial updates
  return updateSubject(req, res);
};

const getSubjects = async (req, res) => {
  try {
    const {
      page = 1,
      limit = 10,
      search,
      order,
      includeAudit,
      includeDeleted,
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
      is_active: typeof is_active !== 'undefined' ? parseBoolean(is_active) : undefined,
      includeAudit: parseBoolean(includeAudit),
      includeDeleted: parseBoolean(includeDeleted),
    };
    if (parsedOrder) opts.order = parsedOrder;

    const result = await subjectService.getSubjects(opts);
    return res.status(200).json({ success: true, ...result });
  } catch (err) {
    console.error('getSubjects error', err);
    return res.status(500).json({ success: false, message: err.message || 'Server error' });
  }
};

const getSubjectById = async (req, res) => {
  try {
    const { id } = req.params;
    const includeDeleted = parseBoolean(req.query.includeDeleted);
    const includeAudit = typeof req.query.includeAudit === 'undefined' ? true : parseBoolean(req.query.includeAudit);
    const subject = await subjectService.getSubjectById(id, { includeDeleted, includeAudit });
    return res.status(200).json({ success: true, data: subject });
  } catch (err) {
    console.error('getSubjectById error', err);
    if (err.message && err.message.toLowerCase().includes('not found')) {
      return res.status(404).json({ success: false, message: err.message });
    }
    return res.status(500).json({ success: false, message: err.message || 'Server error' });
  }
};

const deleteSubject = async (req, res) => {
  try {
    const { id } = req.params;
    const deletedByMeta = {};
    if (req.user) {
      deletedByMeta.deleted_by = req.user.id;
      deletedByMeta.deleted_by_name = req.user.name;
      deletedByMeta.deleted_by_email = req.user.email;
    }
    await subjectService.deleteSubject(id, deletedByMeta);
    return res.status(200).json({ success: true, message: 'Subject deleted (soft)' });
  } catch (err) {
    console.error('deleteSubject error', err);
    if (err.message && err.message.toLowerCase().includes('not found')) {
      return res.status(404).json({ success: false, message: err.message });
    }
    return res.status(500).json({ success: false, message: err.message || 'Server error' });
  }
};

const restoreSubject = async (req, res) => {
  try {
    const { id } = req.params;
    const restoredByMeta = {};
    if (req.user) {
      restoredByMeta.updated_by = req.user.id;
      restoredByMeta.updated_by_name = req.user.name;
      restoredByMeta.updated_by_email = req.user.email;
    }
    const subject = await subjectService.restoreSubject(id, restoredByMeta);
    return res.status(200).json({ success: true, data: subject });
  } catch (err) {
    console.error('restoreSubject error', err);
    if (err.message && err.message.toLowerCase().includes('not found')) {
      return res.status(404).json({ success: false, message: err.message });
    }
    return res.status(500).json({ success: false, message: err.message || 'Server error' });
  }
};

export default {
  createSubject,
  updateSubject,
  patchSubject,
  getSubjects,
  getSubjectById,
  deleteSubject,
  restoreSubject,
};
