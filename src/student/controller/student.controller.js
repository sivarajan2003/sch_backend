// student.controller.js
import studentService from '../service/student.service.js';
import dto from '../dto/student.dto.js';

/**
 * Student Controller
 * Expects req.user ({ id, name, email }) from auth middleware
 */

const parseBoolean = (val) => {
  if (typeof val === 'boolean') return val;
  if (!val && val !== false) return false;
  const v = String(val).toLowerCase();
  return v === 'true' || v === '1' || v === 'yes';
};

const createStudent = async (req, res) => {
  try {
    const payload = req.body;
    if (req.user) {
      payload.created_by = req.user.id;
      payload.created_by_name = req.user.name;
      payload.created_by_email = req.user.email;
    }

    const result = await studentService.createStudent(payload);
    // result contains { student, emailSent, emailError } per service
    return res.status(201).json({ success: true, data: result });
  } catch (err) {
    console.error('createStudent error', err);
    return res.status(500).json({ success: false, message: err.message || 'Server error' });
  }
};

const updateStudent = async (req, res) => {
  try {
    const { id } = req.params;
    const payload = req.body;
    if (req.user) {
      payload.updated_by = req.user.id;
      payload.updated_by_name = req.user.name;
      payload.updated_by_email = req.user.email;
    }

    const updated = await studentService.updateStudent(id, payload);
    return res.status(200).json({ success: true, data: updated });
  } catch (err) {
    console.error('updateStudent error', err);
    if (err.message && err.message.toLowerCase().includes('not found')) {
      return res.status(404).json({ success: false, message: err.message });
    }
    return res.status(500).json({ success: false, message: err.message || 'Server error' });
  }
};

const patchStudent = async (req, res) => {
  // alias for partial updates
  return updateStudent(req, res);
};

const getStudents = async (req, res) => {
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
      academic_year,
      includeParent,
      includeAcademicConfig,
      current_academic_config_id,
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
      current_academic_config_id: current_academic_config_id || undefined,
      academic_year: academic_year || undefined,
      includeAudit: parseBoolean(includeAudit),
      includeDeleted: parseBoolean(includeDeleted),
      includeParent: parseBoolean(includeParent),
      includeAcademicConfig: parseBoolean(includeAcademicConfig),
    };
    if (parsedOrder) opts.order = parsedOrder;

    const result = await studentService.getStudents(opts);
    return res.status(200).json({ success: true, ...result });
  } catch (err) {
    console.error('getStudents error', err);
    return res.status(500).json({ success: false, message: err.message || 'Server error' });
  }
};

const getStudentById = async (req, res) => {
  try {
    const { id } = req.params;
    const includeDeleted = parseBoolean(req.query.includeDeleted);
    const includeAudit = typeof req.query.includeAudit === 'undefined' ? true : parseBoolean(req.query.includeAudit);
    const includeParent = parseBoolean(req.query.includeParent);
    const includeAcademicConfig = parseBoolean(req.query.includeAcademicConfig);
    const student = await studentService.getStudentById(id, { includeDeleted, includeAudit, includeParent, includeAcademicConfig });
    return res.status(200).json({ success: true, data: student });
  } catch (err) {
    console.error('getStudentById error', err);
    if (err.message && err.message.toLowerCase().includes('not found')) {
      return res.status(404).json({ success: false, message: err.message });
    }
    return res.status(500).json({ success: false, message: err.message || 'Server error' });
  }
};

const deleteStudent = async (req, res) => {
  try {
    const { id } = req.params;
    const deletedByMeta = {};
    if (req.user) {
      deletedByMeta.deleted_by = req.user.id;
      deletedByMeta.deleted_by_name = req.user.name;
      deletedByMeta.deleted_by_email = req.user.email;
    }
    await studentService.deleteStudent(id, deletedByMeta);
    return res.status(200).json({ success: true, message: 'Student deleted (soft)' });
  } catch (err) {
    console.error('deleteStudent error', err);
    if (err.message && err.message.toLowerCase().includes('not found')) {
      return res.status(404).json({ success: false, message: err.message });
    }
    return res.status(500).json({ success: false, message: err.message || 'Server error' });
  }
};

const restoreStudent = async (req, res) => {
  try {
    const { id } = req.params;
    const restoredByMeta = {};
    if (req.user) {
      restoredByMeta.updated_by = req.user.id;
      restoredByMeta.updated_by_name = req.user.name;
      restoredByMeta.updated_by_email = req.user.email;
    }
    const student = await studentService.restoreStudent(id, restoredByMeta);
    return res.status(200).json({ success: true, data: student });
  } catch (err) {
    console.error('restoreStudent error', err);
    if (err.message && err.message.toLowerCase().includes('not found')) {
      return res.status(404).json({ success: false, message: err.message });
    }
    return res.status(500).json({ success: false, message: err.message || 'Server error' });
  }
};

export default {
  createStudent,
  updateStudent,
  patchStudent,
  getStudents,
  getStudentById,
  deleteStudent,
  restoreStudent,
};
