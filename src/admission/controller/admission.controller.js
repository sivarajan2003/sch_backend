//admission.controller.js
import admissionService from '../service/admission.service.js';
import dto from '../dto/admission.dto.js';

/* ============================
   UTILS
============================ */

const parseBoolean = (val) => {
  if (typeof val === 'boolean') return val;
  if (!val && val !== false) return false;
  const v = String(val).toLowerCase();
  return v === 'true' || v === '1' || v === 'yes';
};

/* ============================
   CREATE ADMISSION
============================ */

const createAdmission = async (req, res) => {
  try {
    const payload = dto.createAdmissionSchema.parse(req.body);

    if (req.user?.id) {
      payload.created_by = req.user.id;
      payload.created_by_name = req.user.name || null;
      payload.created_by_email = req.user.email || null;
    }

    const result = await admissionService.createAdmission(payload);

    return res.status(201).json({
      success: true,
      data: result,
    });
  } catch (err) {
    // ✅ SAFE LOGGING (NO CRASH)
    console.error('createAdmission error:', err?.message);

    if (err?.name === 'ZodError') {
      return res.status(400).json({
        success: false,
        errors: err.errors,
      });
    }

    return res.status(500).json({
      success: false,
      message: err?.message || 'Server error',
    });
  }
};


/* ============================
   UPDATE ADMISSION
============================ */

const updateAdmission = async (req, res) => {
  try {
    const { id } = req.params;
    const payload = dto.updateAdmissionSchema.parse(req.body);

    if (req.user) {
      payload.updated_by = req.user.id;
      payload.updated_by_name = req.user.name;
      payload.updated_by_email = req.user.email;
    }

    const updated = await admissionService.updateAdmission(id, payload);

    return res.status(200).json({
      success: true,
      data: updated,
    });
  } catch (err) {
    console.error('updateAdmission error', err);

    if (err.name === 'ZodError') {
      return res.status(400).json({
        success: false,
        errors: err.errors,
      });
    }

    if (err.message?.toLowerCase().includes('not found')) {
      return res.status(404).json({
        success: false,
        message: err.message,
      });
    }

    return res.status(500).json({
      success: false,
      message: err.message || 'Server error',
    });
  }
};

// PATCH alias
const patchAdmission = async (req, res) => updateAdmission(req, res);

/* ============================
   VERIFY DOCUMENTS (NEW)
============================ */

const verifyAdmissionDocuments = async (req, res) => {
  try {
    const { id } = req.params;

    // Validate document verification payload
    const payload = dto.verifyDocumentsSchema.parse(req.body);

    const verifiedByMeta = {};

    if (req.user) {
      verifiedByMeta.updated_by = req.user.id;
      verifiedByMeta.updated_by_name = req.user.name;
      verifiedByMeta.updated_by_email = req.user.email;
    }

    const updatedAdmission =
      await admissionService.verifyAdmissionDocuments(
        id,
        payload,
        verifiedByMeta
      );

    return res.status(200).json({
      success: true,
      message: 'Documents verified successfully',
      data: updatedAdmission,
    });
  } catch (err) {
    console.error('verifyAdmissionDocuments error', err);

    if (err.name === 'ZodError') {
      return res.status(400).json({
        success: false,
        errors: err.errors,
      });
    }

    if (err.message?.toLowerCase().includes('not found')) {
      return res.status(404).json({
        success: false,
        message: err.message,
      });
    }

    return res.status(500).json({
      success: false,
      message: err.message || 'Server error',
    });
  }
};

/* ============================
   GET ALL ADMISSIONS
============================ */

const getAdmissions = async (req, res) => {
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

    // ✅ Always apply Parent restriction
    if (req.user.role === 'Parent') {
      filters.parent_email = req.user.email;
    }

    // ✅ Merge additional filters instead of overriding
    if (req.query.filters) {
      try {
        const parsedFilters =
          typeof req.query.filters === 'object'
            ? req.query.filters
            : JSON.parse(req.query.filters);

        filters = {
          ...parsedFilters,
          ...filters, // parent_email will NOT be overridden
        };
      } catch {
        return res.status(400).json({
          success: false,
          message: 'Invalid filters JSON',
        });
      }
    }

    let parsedOrder;
    if (order) {
      try {
        parsedOrder = typeof order === 'object' ? order : JSON.parse(order);
      } catch {
        if (typeof order === 'string' && order.includes(':')) {
          const [col, dir] = order.split(':');
          parsedOrder = [[col, dir.toUpperCase()]];
        }
      }
    }

    const result = await admissionService.getAdmissions({
      page: Number(page),
      limit: Number(limit),
      filters,
      search,
      startDate,
      endDate,
      includeAudit: parseBoolean(includeAudit),
      includeDeleted: parseBoolean(includeDeleted),
      order: parsedOrder,
    });

    return res.status(200).json({
      success: true,
      ...result,
    });
  } catch (err) {
    console.error('getAdmissions error', err);
    return res.status(500).json({
      success: false,
      message: err.message || 'Server error',
    });
  }
};

/* ============================
   GET ADMISSION BY ID
============================ */

const getAdmissionById = async (req, res) => {
  try {
    const { id } = req.params;

    const includeDeleted = parseBoolean(req.query.includeDeleted);
    const includeAudit =
      typeof req.query.includeAudit === 'undefined'
        ? true
        : parseBoolean(req.query.includeAudit);

    const admission = await admissionService.getAdmissionById(id, {
      includeDeleted,
      includeAudit,
    });

    return res.status(200).json({
      success: true,
      data: admission,
    });
  } catch (err) {
    console.error('getAdmissionById error', err);

    if (err.message?.toLowerCase().includes('not found')) {
      return res.status(404).json({
        success: false,
        message: err.message,
      });
    }

    return res.status(500).json({
      success: false,
      message: err.message || 'Server error',
    });
  }
};

/* ============================
   DELETE ADMISSION (SOFT)
============================ */

const deleteAdmission = async (req, res) => {
  try {
    const { id } = req.params;

    const deletedByMeta = {};

    if (req.user) {
      deletedByMeta.deleted_by = req.user.id;
      deletedByMeta.deleted_by_name = req.user.name;
      deletedByMeta.deleted_by_email = req.user.email;
    }

    await admissionService.deleteAdmission(id, deletedByMeta);

    return res.status(200).json({
      success: true,
      message: 'Admission deleted (soft)',
    });
  } catch (err) {
    console.error('deleteAdmission error', err);

    if (err.message?.toLowerCase().includes('not found')) {
      return res.status(404).json({
        success: false,
        message: err.message,
      });
    }

    return res.status(500).json({
      success: false,
      message: err.message || 'Server error',
    });
  }
};

/* ============================
   RESTORE ADMISSION
============================ */

const restoreAdmission = async (req, res) => {
  try {
    const { id } = req.params;

    const restoredByMeta = {};

    if (req.user) {
      restoredByMeta.updated_by = req.user.id;
      restoredByMeta.updated_by_name = req.user.name;
      restoredByMeta.updated_by_email = req.user.email;
    }

    const admission = await admissionService.restoreAdmission(id, restoredByMeta);

    return res.status(200).json({
      success: true,
      data: admission,
    });
  } catch (err) {
    console.error('restoreAdmission error', err);

    if (err.message?.toLowerCase().includes('not found')) {
      return res.status(404).json({
        success: false,
        message: err.message,
      });
    }

    return res.status(500).json({
      success: false,
      message: err.message || 'Server error',
    });
  }
};

/* ============================
   STATS
============================ */

const getStats = async (req, res) => {
  try {
    const { startDate, endDate } = req.query;
    const stats = await admissionService.getAdmissionStats({ startDate, endDate });

    return res.status(200).json({
      success: true,
      data: stats,
    });
  } catch (err) {
    console.error('getStats error', err);
    return res.status(500).json({
      success: false,
      message: err.message || 'Server error',
    });
  }
};

const getSeatAllocationStats = async (req, res) => {
  try {
    const stats = await admissionService.getSeatAllocationStats();

    return res.status(200).json({
      success: true,
      data: stats,
    });
  } catch (err) {
    console.error('getSeatAllocationStats error', err);
    return res.status(500).json({
      success: false,
      message: err.message || 'Server error',
    });
  }
};

/* ============================
   EXPORTS
============================ */

export default {
  createAdmission,
  updateAdmission,
  patchAdmission,
  verifyAdmissionDocuments, 
  getAdmissions,
  getAdmissionById,
  deleteAdmission,
  restoreAdmission,
  getStats,
  getSeatAllocationStats,
};
