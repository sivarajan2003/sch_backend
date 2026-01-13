import teacherService from '../service/teacher.service.js';
import dto from '../dto/teacher.dto.js';


const parseBoolean = (val) => {
  if (typeof val === 'boolean') return val;
  if (!val && val !== false) return false;
  const v = String(val).toLowerCase();
  return v === 'true' || v === '1' || v === 'yes';
};

const createTeacher = async (req, res) => {
  try {
    // validate via middleware; here assume body is valid
    const payload = req.body;
    if (req.user) {
      payload.created_by = req.user.id;
      payload.created_by_name = req.user.name;
      payload.created_by_email = req.user.email;
    }

    const teacher = await teacherService.createTeacher(payload);
    return res.status(201).json({ success: true, data: teacher });
  } catch (err) {
    console.error('createTeacher error', err);
    return res.status(500).json({ success: false, message: err.message || 'Server error' });
  }
};

const updateTeacher = async (req, res) => {
  try {
    const { id } = req.params;
    const payload = req.body;
    if (req.user) {
      payload.updated_by = req.user.id;
      payload.updated_by_name = req.user.name;
      payload.updated_by_email = req.user.email;
    }

    const updated = await teacherService.updateTeacher(id, payload);
    return res.status(200).json({ success: true, data: updated });
  } catch (err) {
    console.error('updateTeacher error', err);
    if (err.message && err.message.toLowerCase().includes('not found')) return res.status(404).json({ success: false, message: err.message });
    return res.status(500).json({ success: false, message: err.message || 'Server error' });
  }
};

const patchTeacher = async (req, res) => {
  // alias to update for partial updates
  return updateTeacher(req, res);
};

const getTeachers = async (req, res) => {
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
      is_master,
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
      is_master: typeof is_master !== 'undefined' ? parseBoolean(is_master) : undefined,
      includeAudit: parseBoolean(includeAudit),
      includeDeleted: parseBoolean(includeDeleted),
    };
    if (parsedOrder) opts.order = parsedOrder;

    const result = await teacherService.getTeachers(opts);
    return res.status(200).json({ success: true, ...result });
  } catch (err) {
    console.error('getTeachers error', err);
    return res.status(500).json({ success: false, message: err.message || 'Server error' });
  }
};

const getTeacherById = async (req, res) => {
  try {
    const { id } = req.params;
    const includeDeleted = parseBoolean(req.query.includeDeleted);
    const includeAudit = typeof req.query.includeAudit === 'undefined' ? true : parseBoolean(req.query.includeAudit);
    const teacher = await teacherService.getTeacherById(id, { includeDeleted, includeAudit });
    return res.status(200).json({ success: true, data: teacher });
  } catch (err) {
    console.error('getTeacherById error', err);
    if (err.message && err.message.toLowerCase().includes('not found')) return res.status(404).json({ success: false, message: err.message });
    return res.status(500).json({ success: false, message: err.message || 'Server error' });
  }
};

const deleteTeacher = async (req, res) => {
  try {
    const { id } = req.params;
    const deletedByMeta = {};
    if (req.user) {
      deletedByMeta.deleted_by = req.user.id;
      deletedByMeta.deleted_by_name = req.user.name;
      deletedByMeta.deleted_by_email = req.user.email;
    }
    await teacherService.deleteTeacher(id, deletedByMeta);
    return res.status(200).json({ success: true, message: 'Teacher deleted (soft)' });
  } catch (err) {
    console.error('deleteTeacher error', err);
    if (err.message && err.message.toLowerCase().includes('not found')) return res.status(404).json({ success: false, message: err.message });
    return res.status(500).json({ success: false, message: err.message || 'Server error' });
  }
};

const restoreTeacher = async (req, res) => {
  try {
    const { id } = req.params;
    const restoredByMeta = {};
    if (req.user) {
      restoredByMeta.updated_by = req.user.id;
      restoredByMeta.updated_by_name = req.user.name;
      restoredByMeta.updated_by_email = req.user.email;
    }
    const teacher = await teacherService.restoreTeacher(id, restoredByMeta);
    return res.status(200).json({ success: true, data: teacher });
  } catch (err) {
    console.error('restoreTeacher error', err);
    if (err.message && err.message.toLowerCase().includes('not found')) return res.status(404).json({ success: false, message: err.message });
    return res.status(500).json({ success: false, message: err.message || 'Server error' });
  }
};

export default {
  createTeacher,
  updateTeacher,
  patchTeacher,
  getTeachers,
  getTeacherById,
  deleteTeacher,
  restoreTeacher,
};