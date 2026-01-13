// classsubjectteacher.controller.js
import classSubjectTeacherService from '../service/classsubjectteacher.service.js';
import dto from '../dto/classsubjectteacher.dto.js';

/**
 * ClassSubjectTeacher Controller
 * Expects req.user ({ id, name, email }) from auth middleware
 */

const parseBoolean = (val) => {
  if (typeof val === 'boolean') return val;
  if (!val && val !== false) return false;
  const v = String(val).toLowerCase();
  return v === 'true' || v === '1' || v === 'yes';
};

const createClassSubjectTeacher = async (req, res) => {
  try {
    const payload = req.body;
    if (req.user) {
      payload.created_by = req.user.id;
      payload.created_by_name = req.user.name;
      payload.created_by_email = req.user.email;
    }

    // optional: validate with dto
    // const parsed = dto.createClassSubjectTeacherSchema.parse(payload);

    const item = await classSubjectTeacherService.createClassSubjectTeacher(payload);
    return res.status(201).json({ success: true, data: item });
  } catch (err) {
    console.error('createClassSubjectTeacher error', err);
    return res.status(500).json({ success: false, message: err.message || 'Server error' });
  }
};

const updateClassSubjectTeacher = async (req, res) => {
  try {
    const { id } = req.params;
    const payload = req.body;
    if (req.user) {
      payload.updated_by = req.user.id;
      payload.updated_by_name = req.user.name;
      payload.updated_by_email = req.user.email;
    }

    const updated = await classSubjectTeacherService.updateClassSubjectTeacher(id, payload);
    return res.status(200).json({ success: true, data: updated });
  } catch (err) {
    console.error('updateClassSubjectTeacher error', err);
    if (err.message && err.message.toLowerCase().includes('not found')) {
      return res.status(404).json({ success: false, message: err.message });
    }
    return res.status(500).json({ success: false, message: err.message || 'Server error' });
  }
};

const patchClassSubjectTeacher = async (req, res) => {
  // alias for partial updates
  return updateClassSubjectTeacher(req, res);
};

const getClassSubjectTeachers = async (req, res) => {
  try {
    const {
      page = 1,
      limit = 20,
      search,
      startDate,
      endDate,
      order,
      includeDeleted,
      includeRelations,
      is_active,
      class_id,
      subject_id,
      teacher_id,
      academicyear_id,
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
  limit: Number(limit) || 20,
  filters,
  search,
  startDate,
  endDate,
  class_id: class_id || undefined,
  subject_id: subject_id || undefined,
  teacher_id: teacher_id || undefined,
  academicyear_id: academicyear_id || undefined,
  is_active: typeof is_active !== 'undefined' ? parseBoolean(is_active) : undefined,
  // If client omits includeRelations, treat it as true. Client can still pass ?includeRelations=false
  includeRelations: (typeof req.query.includeRelations === 'undefined') ? true : parseBoolean(includeRelations),
  includeDeleted: parseBoolean(includeDeleted),
};


    if (parsedOrder) opts.order = parsedOrder;

    const result = await classSubjectTeacherService.getClassSubjectTeachers(opts);
    return res.status(200).json({ success: true, ...result });
  } catch (err) {
    console.error('getClassSubjectTeachers error', err);
    return res.status(500).json({ success: false, message: err.message || 'Server error' });
  }
};

const getClassSubjectTeacherById = async (req, res) => {
  try {
    const { id } = req.params;
    const includeDeleted = parseBoolean(req.query.includeDeleted);
    const includeRelations = typeof req.query.includeRelations === 'undefined' ? true : parseBoolean(req.query.includeRelations);
    const item = await classSubjectTeacherService.getClassSubjectTeacherById(id, { includeDeleted, includeRelations });
    return res.status(200).json({ success: true, data: item });
  } catch (err) {
    console.error('getClassSubjectTeacherById error', err);
    if (err.message && err.message.toLowerCase().includes('not found')) {
      return res.status(404).json({ success: false, message: err.message });
    }
    return res.status(500).json({ success: false, message: err.message || 'Server error' });
  }
};

const deleteClassSubjectTeacher = async (req, res) => {
  try {
    const { id } = req.params;
    const deletedByMeta = {};
    if (req.user) {
      deletedByMeta.deleted_by = req.user.id;
      deletedByMeta.deleted_by_name = req.user.name;
      deletedByMeta.deleted_by_email = req.user.email;
    }
    await classSubjectTeacherService.deleteClassSubjectTeacher(id, deletedByMeta);
    return res.status(200).json({ success: true, message: 'ClassSubjectTeacher deleted (soft)' });
  } catch (err) {
    console.error('deleteClassSubjectTeacher error', err);
    if (err.message && err.message.toLowerCase().includes('not found')) {
      return res.status(404).json({ success: false, message: err.message });
    }
    return res.status(500).json({ success: false, message: err.message || 'Server error' });
  }
};

const restoreClassSubjectTeacher = async (req, res) => {
  try {
    const { id } = req.params;
    const restoredByMeta = {};
    if (req.user) {
      restoredByMeta.updated_by = req.user.id;
      restoredByMeta.updated_by_name = req.user.name;
      restoredByMeta.updated_by_email = req.user.email;
    }
    const item = await classSubjectTeacherService.restoreClassSubjectTeacher(id, restoredByMeta);
    return res.status(200).json({ success: true, data: item });
  } catch (err) {
    console.error('restoreClassSubjectTeacher error', err);
    if (err.message && err.message.toLowerCase().includes('not found')) {
      return res.status(404).json({ success: false, message: err.message });
    }
    return res.status(500).json({ success: false, message: err.message || 'Server error' });
  }
};

export default {
  createClassSubjectTeacher,
  updateClassSubjectTeacher,
  patchClassSubjectTeacher,
  getClassSubjectTeachers,
  getClassSubjectTeacherById,
  deleteClassSubjectTeacher,
  restoreClassSubjectTeacher,
};
