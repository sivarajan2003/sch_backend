// studentattendance.controller.js
import studentAttendanceService from '../service/studentattendance.service.js';
import dto from '../dto/studentattendance.dto.js';

/**
 * Student Attendance Controller
 * Expects req.user ({ id, name, email }) from auth middleware
 */

const parseBoolean = (val) => {
  if (typeof val === 'boolean') return val;
  if (!val && val !== false) return false;
  const v = String(val).toLowerCase();
  return v === 'true' || v === '1' || v === 'yes';
};

// Create a new attendance record
const createAttendance = async (req, res) => {
  try {
    const payload = req.body;

    if (req.user) {
      payload.taken_by = req.body.taken_by ?? req.user.id;  
      payload.created_by = req.user.id;
      payload.created_by_name = req.user.name;
      payload.created_by_email = req.user.email;
    }

    const attendance = await studentAttendanceService.createAttendance(payload);
    return res.status(201).json({ success: true, data: attendance });
  } catch (err) {
    console.error('createAttendance error', err);
    return res.status(500).json({ success: false, message: err.message || 'Server error' });
  }
};

const bulkCreateAttendance = async (req, res) => {
  try {
    const payloads = req.body;

    if (!Array.isArray(payloads) || payloads.length === 0) {
      return res.status(400).json({ success: false, message: 'Payload must be a non-empty array' });
    }

    // enrich with user meta
    if (req.user) {
      payloads.forEach(p => {
        p.taken_by = p.taken_by ?? req.user.id;
        p.created_by = req.user.id;
        p.created_by_name = req.user.name;
        p.created_by_email = req.user.email;
      });
    }

    const attendances = await studentAttendanceService.bulkCreateAttendance(payloads);
    return res.status(201).json({ success: true, data: attendances });
  } catch (err) {
    console.error('bulkCreateAttendance error', err);
    return res.status(500).json({ success: false, message: err.message || 'Server error' });
  }
};

// Update an attendance record
const updateAttendance = async (req, res) => {
  try {
    const { id } = req.params;
    const payload = req.body;

    if (req.user) {
      payload.updated_by = req.user.id;
      payload.updated_by_name = req.user.name;
      payload.updated_by_email = req.user.email;
    }

    const updated = await studentAttendanceService.updateAttendance(id, payload);
    return res.status(200).json({ success: true, data: updated });
  } catch (err) {
    console.error('updateAttendance error', err);
    if (err.message && err.message.toLowerCase().includes('not found')) {
      return res.status(404).json({ success: false, message: err.message });
    }
    return res.status(500).json({ success: false, message: err.message || 'Server error' });
  }
};

// Alias for patch
const patchAttendance = async (req, res) => updateAttendance(req, res);

// Get list of attendance records
const getAttendances = async (req, res) => {
  try {
    const {
      page = 1,
      limit = 10,
      search,
      startDate,
      endDate,
      order,
      includeDeleted,
      student_id,
      teacher_id,
      status,
    } = req.query;

    const filters = { student_id, teacher_id, status };

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
      page: Number(page),
      limit: Number(limit),
      filters,
      search,
      startDate,
      endDate,
      includeDeleted: parseBoolean(includeDeleted),
    };
    if (parsedOrder) opts.order = parsedOrder;

    const result = await studentAttendanceService.getAttendances(opts);
    return res.status(200).json({ success: true, ...result });
  } catch (err) {
    console.error('getAttendances error', err);
    return res.status(500).json({ success: false, message: err.message || 'Server error' });
  }
};

// Get single attendance record by ID
const getAttendanceById = async (req, res) => {
  try {
    const { id } = req.params;
    const includeDeleted = parseBoolean(req.query.includeDeleted);

    const attendance = await studentAttendanceService.getAttendanceById(id, { includeDeleted });
    return res.status(200).json({ success: true, data: attendance });
  } catch (err) {
    console.error('getAttendanceById error', err);
    if (err.message && err.message.toLowerCase().includes('not found')) {
      return res.status(404).json({ success: false, message: err.message });
    }
    return res.status(500).json({ success: false, message: err.message || 'Server error' });
  }
};

// Soft-delete an attendance record
const deleteAttendance = async (req, res) => {
  try {
    const { id } = req.params;
    const deletedByMeta = {};

    if (req.user) {
      deletedByMeta.deleted_by = req.user.id;
      deletedByMeta.deleted_by_name = req.user.name;
      deletedByMeta.deleted_by_email = req.user.email;
    }

    await studentAttendanceService.deleteAttendance(id, deletedByMeta);
    return res.status(200).json({ success: true, message: 'Attendance record deleted (soft)' });
  } catch (err) {
    console.error('deleteAttendance error', err);
    if (err.message && err.message.toLowerCase().includes('not found')) {
      return res.status(404).json({ success: false, message: err.message });
    }
    return res.status(500).json({ success: false, message: err.message || 'Server error' });
  }
};

// Restore a soft-deleted attendance record
const restoreAttendance = async (req, res) => {
  try {
    const { id } = req.params;
    const restoredByMeta = {};

    if (req.user) {
      restoredByMeta.updated_by = req.user.id;
      restoredByMeta.updated_by_name = req.user.name;
      restoredByMeta.updated_by_email = req.user.email;
    }

    const attendance = await studentAttendanceService.restoreAttendance(id, restoredByMeta);
    return res.status(200).json({ success: true, data: attendance });
  } catch (err) {
    console.error('restoreAttendance error', err);
    if (err.message && err.message.toLowerCase().includes('not found')) {
      return res.status(404).json({ success: false, message: err.message });
    }
    return res.status(500).json({ success: false, message: err.message || 'Server error' });
  }
};

export default {
  createAttendance,
  bulkCreateAttendance,
  updateAttendance,
  patchAttendance,
  getAttendances,
  getAttendanceById,
  deleteAttendance,
  restoreAttendance,
};
