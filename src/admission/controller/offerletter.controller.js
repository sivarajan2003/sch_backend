// offerletter.controller.js
import offerLetterService from '../service/offerletter.service.js';
import OfferLetterTemplate from '../models/offerlettertemplate.js';

const parseBoolean = (val) => {
  if (typeof val === 'boolean') return val;
  if (!val && val !== false) return false;
  return String(val).toLowerCase() === 'true' || String(val) === '1';
};

/**
 * CREATE
 */
const createOfferLetter = async (req, res) => {
  try {
    const payload = req.body;

    if (req.user) {
      payload.created_by = req.user.id;
      payload.created_by_name = req.user.name;
      payload.created_by_email = req.user.email;
    }

    const offerLetter = await offerLetterService.createOfferLetter(payload);

    return res.status(201).json({ success: true, data: offerLetter });

  } catch (err) {
    console.error('createOfferLetter error', err);

    if (err.message?.toLowerCase().includes('admission')) {
      return res.status(404).json({ success: false, message: err.message });
    }

    return res.status(500).json({ success: false, message: err.message || 'Server error' });
  }
};


/**
 * UPDATE (PUT)
 */
const updateOfferLetter = async (req, res) => {
  try {
    const { id } = req.params;
    const payload = req.body;

    if (req.user) {
      payload.updated_by = req.user.id;
      payload.updated_by_name = req.user.name;
      payload.updated_by_email = req.user.email;
    }

    const updated = await offerLetterService.updateOfferLetter(id, payload);

    return res.status(200).json({ success: true, data: updated });

  } catch (err) {
    console.error('updateOfferLetter error', err);

    if (err.message?.toLowerCase().includes('not found')) {
      return res.status(404).json({ success: false, message: err.message });
    }

    return res.status(500).json({ success: false, message: err.message || 'Server error' });
  }
};


/**
 * UPDATE STATUS (PATCH)
 */
const updateOfferLetterStatus = async (req, res) => {
  try {
    const { id } = req.params;
    const { status } = req.body;
    const meta = {};

    if (req.user) {
      meta.updated_by = req.user.id;
      meta.updated_by_name = req.user.name;
      meta.updated_by_email = req.user.email;
    }

    const updated = await offerLetterService.updateOfferLetterStatus(id, status, meta);

    return res.status(200).json({ success: true, data: updated });

  } catch (err) {
    console.error('updateOfferLetterStatus error', err);

    if (err.message?.toLowerCase().includes('not found')) {
      return res.status(404).json({ success: false, message: err.message });
    }

    return res.status(500).json({ success: false, message: err.message || 'Server error' });
  }
};


/**
 * UPDATE PAYMENT STATUS (PATCH)
 */
const updatePaymentStatus = async (req, res) => {
  try {
    const { id } = req.params;
    const { payment_status } = req.body;
    const meta = {};

    if (req.user) {
      meta.updated_by = req.user.id;
      meta.updated_by_name = req.user.name;
      meta.updated_by_email = req.user.email;
    }

    const updated = await offerLetterService.updatePaymentStatus(id, payment_status, meta);

    return res.status(200).json({ success: true, data: updated });

  } catch (err) {
    console.error('updatePaymentStatus error', err);

    if (err.message?.toLowerCase().includes('not found')) {
      return res.status(404).json({ success: false, message: err.message });
    }

    return res.status(500).json({ success: false, message: err.message || 'Server error' });
  }
};


/**
 * GET ALL
 */
const getOfferLetters = async (req, res) => {
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
        filters = typeof req.query.filters === 'object'
          ? req.query.filters
          : JSON.parse(req.query.filters);
      } catch {
        return res.status(400).json({ success: false, message: 'Invalid filters JSON' });
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

    const result = await offerLetterService.getOfferLetters(options);

    return res.status(200).json({ success: true, ...result });

  } catch (err) {
    console.error('getOfferLetters error', err);
    return res.status(500).json({ success: false, message: err.message || 'Server error' });
  }
};


/**
 * GET BY ID
 */
const getOfferLetterById = async (req, res) => {
  try {
    const { id } = req.params;
    const includeDeleted = parseBoolean(req.query.includeDeleted);
    const includeAudit =
      typeof req.query.includeAudit === 'undefined'
        ? true
        : parseBoolean(req.query.includeAudit);

    const offerLetter = await offerLetterService.getOfferLetterById(id, {
      includeDeleted,
      includeAudit,
    });

    return res.status(200).json({ success: true, data: offerLetter });

  } catch (err) {
    console.error('getOfferLetterById error', err);

    if (err.message?.toLowerCase().includes('not found')) {
      return res.status(404).json({ success: false, message: err.message });
    }

    return res.status(500).json({ success: false, message: err.message || 'Server error' });
  }
};


/**
 * DELETE (SOFT)
 */
const deleteOfferLetter = async (req, res) => {
  try {
    const { id } = req.params;
    const deletedByMeta = {};

    if (req.user) {
      deletedByMeta.deleted_by = req.user.id;
      deletedByMeta.deleted_by_name = req.user.name;
      deletedByMeta.deleted_by_email = req.user.email;
    }

    await offerLetterService.deleteOfferLetter(id, deletedByMeta);

    return res.status(200).json({ success: true, message: 'Offer letter deleted' });

  } catch (err) {
    console.error('deleteOfferLetter error', err);

    if (err.message?.toLowerCase().includes('not found')) {
      return res.status(404).json({ success: false, message: err.message });
    }

    return res.status(500).json({ success: false, message: err.message || 'Server error' });
  }
};


/**
 * RESTORE
 */
const restoreOfferLetter = async (req, res) => {
  try {
    const { id } = req.params;
    const restoredByMeta = {};

    if (req.user) {
      restoredByMeta.updated_by = req.user.id;
      restoredByMeta.updated_by_name = req.user.name;
      restoredByMeta.updated_by_email = req.user.email;
    }

    const offerLetter = await offerLetterService.restoreOfferLetter(id, restoredByMeta);

    return res.status(200).json({ success: true, data: offerLetter });

  } catch (err) {
    console.error('restoreOfferLetter error', err);

    if (err.message?.toLowerCase().includes('not found')) {
      return res.status(404).json({ success: false, message: err.message });
    }

    return res.status(500).json({ success: false, message: err.message || 'Server error' });
  }
};


/**
 * GET TEMPLATE
 */
const getTemplate = async (req, res) => {
  try {
    const template = await OfferLetterTemplate.findOne({
      order: [['createdAt', 'DESC']],
    });

    if (!template) {
      return res.status(200).json({
        success: true,
        data: {
          header_title: 'ATELIER SCHOOL',
          header_subtitle: 'Excellence in Education',
          header_logo: '',
          footer_text: '123 School Lane, Education City\nContact: info@atelier.com | +1 234 567 890',
          watermark_text: 'OFFICIAL OFFER',
          watermark_image: '',
          watermark_opacity: 10,
          show_watermark: true,
          principal_signature: '',
          school_seal: '',
        },
      });
    }

    return res.status(200).json({ success: true, data: template });

  } catch (err) {
    console.error('getTemplate error', err);
    return res.status(500).json({ success: false, message: err.message });
  }
};


/**
 * SAVE TEMPLATE
 */
const saveTemplate = async (req, res) => {
  try {
    const template = await OfferLetterTemplate.create(req.body);
    return res.status(200).json({ success: true, message: 'Template saved', data: template });
  } catch (err) {
    console.error('saveTemplate error', err);
    return res.status(500).json({ success: false, message: err.message });
  }
};


export default {
  createOfferLetter,
  updateOfferLetter,
  updateOfferLetterStatus,
  updatePaymentStatus,
  getOfferLetters,
  getOfferLetterById,
  deleteOfferLetter,
  restoreOfferLetter,
  getTemplate,
  saveTemplate,
};
