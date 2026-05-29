import interviewService from '../service/interview.service.js';
import dto from '../dto/interview.dto.js';


const parseBoolean = (val) => {
  if (typeof val === 'boolean') return val;
  if (!val && val !== false) return false;
  const v = String(val).toLowerCase();
  return v === 'true' || v === '1' || v === 'yes';
};


/**
 * ------------------------
 * CREATE INTERVIEW
 * ------------------------
 */
const createInterview = async (req, res) => {
  try {

    const payload = req.body;

    // Attach audit info
    if (req.user) {
      payload.created_by = req.user.id;
      payload.created_by_name = req.user.name;
      payload.created_by_email = req.user.email;
    }

    const interview = await interviewService.createInterview(payload);

    return res.status(201).json({
      success: true,
      data: interview
    });

  } catch (err) {

    console.error('createInterview error', err);

    if (err.message && err.message.toLowerCase().includes('admission')) {
      return res.status(404).json({
        success: false,
        message: err.message
      });
    }

    return res.status(500).json({
      success: false,
      message: err.message || 'Server error'
    });

  }
};


/**
 * ------------------------
 * UPDATE INTERVIEW
 * ------------------------
 */
const updateInterview = async (req, res) => {
  try {

    const { id } = req.params;
    const payload = req.body;

    // Attach audit info
    if (req.user) {
      payload.updated_by = req.user.id;
      payload.updated_by_name = req.user.name;
      payload.updated_by_email = req.user.email;
    }

    const updated = await interviewService.updateInterview(id, payload);

    return res.status(200).json({
      success: true,
      data: updated
    });

  } catch (err) {

    console.error('updateInterview error', err);

    if (err.message && err.message.toLowerCase().includes('not found')) {
      return res.status(404).json({
        success: false,
        message: err.message
      });
    }

    return res.status(500).json({
      success: false,
      message: err.message || 'Server error'
    });

  }
};


// PATCH alias
const patchInterview = async (req, res) => {
  return updateInterview(req, res);
};


/**
 * ------------------------
 * VERIFY DOCUMENTS
 * ------------------------
 */
const verifyDocuments = async (req, res) => {
  try {

    const { id } = req.params;
    const payload = req.body;

    const meta = {};

    if (req.user) {
      meta.updated_by = req.user.id;
      meta.updated_by_name = req.user.name;
      meta.updated_by_email = req.user.email;
    }

    const result = await interviewService.verifyDocuments(
      id,
      payload.documents_status,
      payload.remarks,
      meta
    );

    return res.status(200).json({
      success: true,
      data: result
    });

  } catch (err) {

    console.error('verifyDocuments error', err);

    if (err.message && err.message.toLowerCase().includes('not found')) {
      return res.status(404).json({
        success: false,
        message: err.message
      });
    }

    return res.status(500).json({
      success: false,
      message: err.message || 'Server error'
    });

  }
};


/**
 * ------------------------
 * UPDATE INTERVIEW STATUS
 * ------------------------
 */
const updateInterviewStatus = async (req, res) => {
  try {

    const { id } = req.params;
    const payload = req.body;

    const meta = {};

    if (req.user) {
      meta.updated_by = req.user.id;
      meta.updated_by_name = req.user.name;
      meta.updated_by_email = req.user.email;
    }

    const updated = await interviewService.updateInterviewStatus(
      id,
      payload.status,
      meta
    );

    return res.status(200).json({
      success: true,
      data: updated
    });

  } catch (err) {

    console.error('updateInterviewStatus error', err);

    if (err.message && err.message.toLowerCase().includes('not found')) {
      return res.status(404).json({
        success: false,
        message: err.message
      });
    }

    return res.status(500).json({
      success: false,
      message: err.message || 'Server error'
    });

  }
};


/**
 * ------------------------
 * GET ALL INTERVIEWS
 * ------------------------
 */
const getInterviews = async (req, res) => {
  try {

    const {
      page = 1,
      limit = 10,
      search,
      startDate,
      endDate,
      order,
      includeAudit,
      includeDeleted
    } = req.query;

    let filters = {};

    // Parse filters JSON
    if (req.query.filters) {
      try {
        filters =
          typeof req.query.filters === 'object'
            ? req.query.filters
            : JSON.parse(req.query.filters);
      } catch (error) {
        return res.status(400).json({
          success: false,
          message: 'Invalid filters JSON'
        });
      }
    }

    // Parse order
    let parsedOrder;
    if (order) {
      try {
        parsedOrder = typeof order === 'object'
          ? order
          : JSON.parse(order);
      } catch (error) {
        if (typeof order === 'string' && order.includes(':')) {
          const [col, dir] = order.split(':');
          parsedOrder = [[col, dir.toUpperCase()]];
        }
      }
    }

    const options = {
      page: Number(page) || 1,
      limit: Number(limit) || 10,
      filters,
      search,
      startDate,
      endDate,
      includeAudit: parseBoolean(includeAudit),
      includeDeleted: parseBoolean(includeDeleted),
    };

    if (parsedOrder) options.order = parsedOrder;

    const result = await interviewService.getInterviews(options);

    return res.status(200).json({
      success: true,
      ...result
    });

  } catch (err) {

    console.error('getInterviews error', err);

    return res.status(500).json({
      success: false,
      message: err.message || 'Server error'
    });

  }
};


/**
 * ------------------------
 * GET INTERVIEW BY ID
 * ------------------------
 */
const getInterviewById = async (req, res) => {
  try {

    const { id } = req.params;

    const includeDeleted = parseBoolean(req.query.includeDeleted);

    const includeAudit =
      typeof req.query.includeAudit === 'undefined'
        ? true
        : parseBoolean(req.query.includeAudit);

    const interview = await interviewService.getInterviewById(id, {
      includeDeleted,
      includeAudit
    });

    return res.status(200).json({
      success: true,
      data: interview
    });

  } catch (err) {

    console.error('getInterviewById error', err);

    if (err.message && err.message.toLowerCase().includes('not found')) {
      return res.status(404).json({
        success: false,
        message: err.message
      });
    }

    return res.status(500).json({
      success: false,
      message: err.message || 'Server error'
    });

  }
};


/**
 * ------------------------
 * DELETE INTERVIEW (SOFT)
 * ------------------------
 */
const deleteInterview = async (req, res) => {
  try {

    const { id } = req.params;

    const deletedByMeta = {};

    if (req.user) {
      deletedByMeta.deleted_by = req.user.id;
      deletedByMeta.deleted_by_name = req.user.name;
      deletedByMeta.deleted_by_email = req.user.email;
    }

    await interviewService.deleteInterview(id, deletedByMeta);

    return res.status(200).json({
      success: true,
      message: 'Interview deleted (soft)'
    });

  } catch (err) {

    console.error('deleteInterview error', err);

    if (err.message && err.message.toLowerCase().includes('not found')) {
      return res.status(404).json({
        success: false,
        message: err.message
      });
    }

    return res.status(500).json({
      success: false,
      message: err.message || 'Server error'
    });

  }
};


/**
 * ------------------------
 * RESTORE INTERVIEW
 * ------------------------
 */
const restoreInterview = async (req, res) => {
  try {

    const { id } = req.params;

    const restoredByMeta = {};

    if (req.user) {
      restoredByMeta.updated_by = req.user.id;
      restoredByMeta.updated_by_name = req.user.name;
      restoredByMeta.updated_by_email = req.user.email;
    }

    const interview = await interviewService.restoreInterview(id, restoredByMeta);

    return res.status(200).json({
      success: true,
      data: interview
    });

  } catch (err) {

    console.error('restoreInterview error', err);

    if (err.message && err.message.toLowerCase().includes('not found')) {
      return res.status(404).json({
        success: false,
        message: err.message
      });
    }

    return res.status(500).json({
      success: false,
      message: err.message || 'Server error'
    });

  }
};


export default {
  createInterview,
  updateInterview,
  patchInterview,
  verifyDocuments,
  updateInterviewStatus,
  getInterviews,
  getInterviewById,
  deleteInterview,
  restoreInterview
};
