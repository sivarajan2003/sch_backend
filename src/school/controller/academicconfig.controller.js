// academicconfig.controller.js
import academicConfigService from '../service/academicconfig.service.js';
import dto from '../dto/academicconfig.dto.js';

/**
 * AcademicyearConfig Controller
 * Expects req.user ({ id, name, email }) from auth middleware
 */

const parseBoolean = (val) => {
  if (typeof val === 'boolean') return val;
  if (!val && val !== false) return false;
  const v = String(val).toLowerCase();
  return v === 'true' || v === '1' || v === 'yes';
};

const createAcademicConfig = async (req, res) => {
  try {
    const payload = req.body;
    if (req.user) {
      payload.created_by = req.user.id;
      payload.created_by_name = req.user.name;
      payload.created_by_email = req.user.email;
    }

    const result = await academicConfigService.createAcademicConfig(payload);
    // result: { config, emailSent, emailError }
    return res.status(201).json({ success: true, data: result });
  } catch (err) {
    console.error('createAcademicConfig error', err);
    return res.status(500).json({ success: false, message: err.message || 'Server error' });
  }
};

const updateAcademicConfig = async (req, res) => {
  try {
    const { id } = req.params;
    const payload = req.body;
    if (req.user) {
      payload.updated_by = req.user.id;
      payload.updated_by_name = req.user.name;
      payload.updated_by_email = req.user.email;
    }

    const updated = await academicConfigService.updateAcademicConfig(id, payload);
    return res.status(200).json({ success: true, data: updated });
  } catch (err) {
    console.error('updateAcademicConfig error', err);
    if (err.message && err.message.toLowerCase().includes('not found')) {
      return res.status(404).json({ success: false, message: err.message });
    }
    return res.status(500).json({ success: false, message: err.message || 'Server error' });
  }
};

const patchAcademicConfig = async (req, res) => {
  // alias for partial updates
  return updateAcademicConfig(req, res);
};

const getAcademicConfigs = async (req, res) => {
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
      academicyear_id,
      class_id,
      class_teacher_id,
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
      academicyear_id: academicyear_id || undefined,
      class_id: class_id || undefined,
      class_teacher_id: class_teacher_id || undefined,
      is_active: typeof is_active !== 'undefined' ? parseBoolean(is_active) : undefined,
      includeRelations: parseBoolean(includeRelations),
      includeAudit: parseBoolean(includeAudit),
      includeDeleted: parseBoolean(includeDeleted),
    };
    if (parsedOrder) opts.order = parsedOrder;

    const result = await academicConfigService.getAcademicConfigs(opts);
    return res.status(200).json({ success: true, ...result });
  } catch (err) {
    console.error('getAcademicConfigs error', err);
    return res.status(500).json({ success: false, message: err.message || 'Server error' });
  }
};

const getAcademicConfigById = async (req, res) => {
  try {
    const { id } = req.params;
    const includeDeleted = parseBoolean(req.query.includeDeleted);
    const includeAudit = typeof req.query.includeAudit === 'undefined' ? true : parseBoolean(req.query.includeAudit);
    const includeRelations = parseBoolean(req.query.includeRelations);
    const item = await academicConfigService.getAcademicConfigById(id, { includeDeleted, includeAudit, includeRelations });
    return res.status(200).json({ success: true, data: item });
  } catch (err) {
    console.error('getAcademicConfigById error', err);
    if (err.message && err.message.toLowerCase().includes('not found')) {
      return res.status(404).json({ success: false, message: err.message });
    }
    return res.status(500).json({ success: false, message: err.message || 'Server error' });
  }
};

const deleteAcademicConfig = async (req, res) => {
  try {
    const { id } = req.params;
    const deletedByMeta = {};
    if (req.user) {
      deletedByMeta.deleted_by = req.user.id;
      deletedByMeta.deleted_by_name = req.user.name;
      deletedByMeta.deleted_by_email = req.user.email;
    }
    await academicConfigService.deleteAcademicConfig(id, deletedByMeta);
    return res.status(200).json({ success: true, message: 'AcademicyearConfig deleted (soft)' });
  } catch (err) {
    console.error('deleteAcademicConfig error', err);
    if (err.message && err.message.toLowerCase().includes('not found')) {
      return res.status(404).json({ success: false, message: err.message });
    }
    return res.status(500).json({ success: false, message: err.message || 'Server error' });
  }
};

const restoreAcademicConfig = async (req, res) => {
  try {
    const { id } = req.params;
    const restoredByMeta = {};
    if (req.user) {
      restoredByMeta.updated_by = req.user.id;
      restoredByMeta.updated_by_name = req.user.name;
      restoredByMeta.updated_by_email = req.user.email;
    }
    const item = await academicConfigService.restoreAcademicConfig(id, restoredByMeta);
    return res.status(200).json({ success: true, data: item });
  } catch (err) {
    console.error('restoreAcademicConfig error', err);
    if (err.message && err.message.toLowerCase().includes('not found')) {
      return res.status(404).json({ success: false, message: err.message });
    }
    return res.status(500).json({ success: false, message: err.message || 'Server error' });
  }
};

export default {
  createAcademicConfig,
  updateAcademicConfig,
  patchAcademicConfig,
  getAcademicConfigs,
  getAcademicConfigById,
  deleteAcademicConfig,
  restoreAcademicConfig,
};
