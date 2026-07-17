// offerletter.service.js

import { sequelize } from '../../db/index.js';
import { Op } from 'sequelize';
import OfferLetter from '../models/offerletter.models.js';
import Admission from '../models/admission.models.js';

/**
 * -------------------------
 * CREATE OFFER LETTER
 * -------------------------
 */
const createOfferLetter = async (payload, { transaction: externalTx = null } = {}) => {
  const tx = externalTx || await sequelize.transaction();

  try {
    const admission = await Admission.findByPk(payload.admission_id, { transaction: tx });

    if (!admission) {
      throw new Error('Admission not found');
    }

    const offerLetter = await OfferLetter.create(payload, { transaction: tx });

    if (!externalTx) await tx.commit();

    return offerLetter;

  } catch (error) {
    if (!externalTx) await tx.rollback();
    throw error;
  }
};


/**
 * -------------------------
 * UPDATE OFFER LETTER
 * -------------------------
 */
const updateOfferLetter = async (id, payload, { transaction: externalTx = null } = {}) => {
  const tx = externalTx || await sequelize.transaction();

  try {
    const [updatedCount] = await OfferLetter.update(payload, {
      where: { id },
      transaction: tx,
    });

    if (!updatedCount) {
      throw new Error('Offer letter not found');
    }

    const updated = await OfferLetter.findByPk(id, { transaction: tx });

    if (!externalTx) await tx.commit();

    return updated;

  } catch (error) {
    if (!externalTx) await tx.rollback();
    throw error;
  }
};


/**
 * -------------------------
 * UPDATE OFFER LETTER STATUS
 * -------------------------
 * status: Generated | Accepted | Declined
 */
const updateOfferLetterStatus = async (
  id,
  status,
  meta = {},
  { transaction: externalTx = null } = {}
) => {
  const tx = externalTx || await sequelize.transaction();

  try {
    const offerLetter = await OfferLetter.findByPk(id, { transaction: tx });

    if (!offerLetter) {
      throw new Error('Offer letter not found');
    }

    await offerLetter.update({
      status,
      updated_by: meta.updated_by || null,
      updated_by_name: meta.updated_by_name || null,
      updated_by_email: meta.updated_by_email || null,
    }, { transaction: tx });

    if (!externalTx) await tx.commit();

    return offerLetter;

  } catch (error) {
    if (!externalTx) await tx.rollback();
    throw error;
  }
};


/**
 * -------------------------
 * UPDATE PAYMENT STATUS
 * -------------------------
 * payment_status: Pending | Completed | Failed
 */
const updatePaymentStatus = async (
  id,
  payment_status,
  meta = {},
  { transaction: externalTx = null } = {}
) => {
  const tx = externalTx || await sequelize.transaction();

  try {
    const offerLetter = await OfferLetter.findByPk(id, { transaction: tx });

    if (!offerLetter) {
      throw new Error('Offer letter not found');
    }

    await offerLetter.update({
      payment_status,
      updated_by: meta.updated_by || null,
      updated_by_name: meta.updated_by_name || null,
      updated_by_email: meta.updated_by_email || null,
    }, { transaction: tx });

    if (!externalTx) await tx.commit();

    return offerLetter;

  } catch (error) {
    if (!externalTx) await tx.rollback();
    throw error;
  }
};


/**
 * -------------------------
 * FILTER BUILDER
 * -------------------------
 */
const buildWhere = ({ filters = {}, search, startDate, endDate } = {}) => {
  const where = {};

  Object.keys(filters || {}).forEach((key) => {
    const value = filters[key];
    if (value === undefined || value === null) return;
    if (Array.isArray(value)) {
      where[key] = { [Op.in]: value };
    } else {
      where[key] = value;
    }
  });

  if (startDate || endDate) {
    where.letter_date = {};
    if (startDate) where.letter_date[Op.gte] = new Date(startDate);
    if (endDate) where.letter_date[Op.lte] = new Date(endDate);
  }

  if (search) {
    const likeOp = Op.iLike || Op.like;
    where[Op.or] = [
      { status: { [likeOp]: `%${search}%` } },
      { payment_status: { [likeOp]: `%${search}%` } },
      { remarks: { [likeOp]: `%${search}%` } },
    ];
  }

  return where;
};


/**
 * -------------------------
 * GET ALL OFFER LETTERS
 * -------------------------
 */
const getOfferLetters = async (options = {}) => {
  const {
    page = 1,
    limit = 10,
    filters,
    search,
    startDate,
    endDate,
    includeAudit = false,
    includeDeleted = false,
    order = [['createdAt', 'DESC']],
  } = options;

  const where = buildWhere({ filters, search, startDate, endDate });

  const baseAttributes = [
    'id', 'admission_id', 'letter_date', 'validity_date',
    'status', 'payment_status', 'remarks', 'is_active',
  ];

  const auditAttributes = [
    'created_by', 'created_by_name', 'created_by_email',
    'updated_by', 'updated_by_name', 'updated_by_email',
    'deleted_by', 'deleted_by_name', 'deleted_by_email',
  ];

  const attributes = includeAudit
    ? baseAttributes.concat(auditAttributes)
    : baseAttributes;

  const queryOptions = {
    where,
    attributes,
    order,
    limit: Number(limit),
    offset: (page - 1) * limit,
    include: [
      {
        model: Admission,
        as: 'admission',
        attributes: ['student_name', 'parent_number', 'parent_email', 'class_applied_id'],
      },
    ],
  };

  if (includeDeleted) queryOptions.paranoid = false;

  const { count, rows } = await OfferLetter.findAndCountAll(queryOptions);
  const totalPages = Math.max(1, Math.ceil(count / limit));

  return { rows, count, page: Number(page), limit: Number(limit), totalPages };
};


/**
 * -------------------------
 * GET OFFER LETTER BY ID
 * -------------------------
 */
const getOfferLetterById = async (id, { includeDeleted = false, includeAudit = true } = {}) => {
  const options = {
    include: [
      {
        model: Admission,
        as: 'admission',
        attributes: ['student_name', 'parent_number', 'parent_email', 'class_applied_id', 'passport_size_photo'],
      },
    ],
  };

  if (includeDeleted) options.paranoid = false;

  if (!includeAudit) {
    options.attributes = {
      exclude: [
        'created_by', 'created_by_name', 'created_by_email',
        'updated_by', 'updated_by_name', 'updated_by_email',
        'deleted_by', 'deleted_by_name', 'deleted_by_email',
      ],
    };
  }

  const offerLetter = await OfferLetter.findByPk(id, options);

  if (!offerLetter) {
    throw new Error('Offer letter not found');
  }

  return offerLetter;
};


/**
 * -------------------------
 * SOFT DELETE OFFER LETTER
 * -------------------------
 */
const deleteOfferLetter = async (
  id,
  deletedByMeta = {},
  { transaction: externalTx = null } = {}
) => {
  const tx = externalTx || await sequelize.transaction();

  try {
    await OfferLetter.update({
      deleted_by: deletedByMeta.deleted_by || null,
      deleted_by_name: deletedByMeta.deleted_by_name || null,
      deleted_by_email: deletedByMeta.deleted_by_email || null,
    }, { where: { id }, transaction: tx });

    const offerLetter = await OfferLetter.findByPk(id, { transaction: tx });

    if (!offerLetter) throw new Error('Offer letter not found');

    await offerLetter.destroy({ transaction: tx });

    if (!externalTx) await tx.commit();

    return true;

  } catch (error) {
    if (!externalTx) await tx.rollback();
    throw error;
  }
};


/**
 * -------------------------
 * RESTORE OFFER LETTER
 * -------------------------
 */
const restoreOfferLetter = async (
  id,
  restoredByMeta = {},
  { transaction: externalTx = null } = {}
) => {
  const tx = externalTx || await sequelize.transaction();

  try {
    await OfferLetter.restore({ where: { id }, transaction: tx });

    await OfferLetter.update({
      deleted_by: null,
      deleted_by_name: null,
      deleted_by_email: null,
      updated_by: restoredByMeta.updated_by || null,
      updated_by_name: restoredByMeta.updated_by_name || null,
      updated_by_email: restoredByMeta.updated_by_email || null,
    }, { where: { id }, transaction: tx });

    const offerLetter = await OfferLetter.findByPk(id, { transaction: tx });

    if (!externalTx) await tx.commit();

    return offerLetter;

  } catch (error) {
    if (!externalTx) await tx.rollback();
    throw error;
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
};
