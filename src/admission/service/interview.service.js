// interview.service.js

import { sequelize } from '../../db/index.js';
import { Op } from 'sequelize';
import Interview from '../models/interview.models.js';
import Admission from '../../admission/models/admission.models.js';

/**
 * -------------------------
 * CREATE INTERVIEW
 * -------------------------
 */
const createInterview = async (payload, { transaction: externalTx = null } = {}) => {
  const tx = externalTx || await sequelize.transaction();

  try {

    // Validate admission exists
    const admission = await Admission.findByPk(payload.admission_id, { transaction: tx });

    if (!admission) {
      throw new Error('Admission not found');
    }

    const interview = await Interview.create(payload, { transaction: tx });

    if (!externalTx) await tx.commit();

    return interview;

  } catch (error) {
    if (!externalTx) await tx.rollback();
    throw error;
  }
};


/**
 * -------------------------
 * UPDATE INTERVIEW
 * -------------------------
 */
const updateInterview = async (id, payload, { transaction: externalTx = null } = {}) => {
  const tx = externalTx || await sequelize.transaction();

  try {

    const [updatedCount] = await Interview.update(payload, {
      where: { id },
      transaction: tx
    });

    if (!updatedCount) {
      throw new Error('Interview not found');
    }

    const updatedInterview = await Interview.findByPk(id, { transaction: tx });

    if (!externalTx) await tx.commit();

    return updatedInterview;

  } catch (error) {
    if (!externalTx) await tx.rollback();
    throw error;
  }
};


/**
 * -------------------------
 * DOCUMENT VERIFICATION
 * -------------------------
 * status: Pending | Verified | Rejected
 */
const verifyDocuments = async (
  interviewId,
  documents_status,
  remarks = null,
  meta = {},
  { transaction: externalTx = null } = {}
) => {

  const tx = externalTx || await sequelize.transaction();

  try {

    const interview = await Interview.findByPk(interviewId, { transaction: tx });

    if (!interview) {
      throw new Error('Interview not found');
    }

    await interview.update({
      documents_status,
      remarks,
      updated_by: meta.updated_by || null,
      updated_by_name: meta.updated_by_name || null,
      updated_by_email: meta.updated_by_email || null,
    }, { transaction: tx });

    if (!externalTx) await tx.commit();

    return interview;

  } catch (error) {
    if (!externalTx) await tx.rollback();
    throw error;
  }
};


/**
 * -------------------------
 * UPDATE INTERVIEW STATUS
 * -------------------------
 * Scheduled | Completed | Cancelled
 */
const updateInterviewStatus = async (
  interviewId,
  status,
  meta = {},
  { transaction: externalTx = null } = {}
) => {

  const tx = externalTx || await sequelize.transaction();

  try {

    const interview = await Interview.findByPk(interviewId, { transaction: tx });

    if (!interview) {
      throw new Error('Interview not found');
    }

    await interview.update({
      status,
      updated_by: meta.updated_by || null,
      updated_by_name: meta.updated_by_name || null,
      updated_by_email: meta.updated_by_email || null,
    }, { transaction: tx });

    if (!externalTx) await tx.commit();

    return interview;

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

  // Exact filters
  Object.keys(filters || {}).forEach(key => {
    const value = filters[key];

    if (value === undefined || value === null) return;

    if (Array.isArray(value)) {
      where[key] = { [Op.in]: value };
    } else {
      where[key] = value;
    }
  });

  // Date filter (interview date)
  if (startDate || endDate) {
    where.interview_date = {};

    if (startDate) where.interview_date[Op.gte] = new Date(startDate);
    if (endDate) where.interview_date[Op.lte] = new Date(endDate);
  }

  // Search
  if (search) {
    const likeOp = Op.iLike || Op.like;

    where[Op.or] = [
      { location: { [likeOp]: `%${search}%` } },
      { status: { [likeOp]: `%${search}%` } },
      { documents_status: { [likeOp]: `%${search}%` } },
      sequelize.where(
        sequelize.cast(sequelize.col('remarks'), 'text'),
        { [likeOp]: `%${search}%` }
      )
    ];
  }

  return where;
};


/**
 * -------------------------
 * GET ALL INTERVIEWS
 * -------------------------
 */
const getInterviews = async (options = {}) => {

  const {
    page = 1,
    limit = 10,
    filters,
    search,
    startDate,
    endDate,
    includeAudit = false,
    includeDeleted = false,
    order = [['interview_date', 'DESC']]
  } = options;

  const where = buildWhere({ filters, search, startDate, endDate });

  const baseAttributes = [
    'id',
    'admission_id',
    'teacher_id',
    'interview_date',
    'location',
    'status',
    'documents_status',
    'remarks',
    'is_active'
  ];

  const auditAttributes = [
    'created_by',
    'created_by_name',
    'created_by_email',
    'updated_by',
    'updated_by_name',
    'updated_by_email',
    'deleted_by',
    'deleted_by_name',
    'deleted_by_email'
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
        attributes: [
          'student_name',
          'parent_number',
          'parent_email',
          'class_applied_id',
          'passport_size_photo',
        ],
      },
    ],
  };

  if (includeDeleted) queryOptions.paranoid = false;

  const { count, rows } = await Interview.findAndCountAll(queryOptions);

  const totalPages = Math.max(1, Math.ceil(count / limit));

  return {
    rows,
    count,
    page: Number(page),
    limit: Number(limit),
    totalPages
  };
};


/**
 * -------------------------
 * GET INTERVIEW BY ID
 * -------------------------
 */
const getInterviewById = async (id, { includeDeleted = false, includeAudit = true } = {}) => {

  const options = {};

  if (includeDeleted) options.paranoid = false;

  if (!includeAudit) {
    options.attributes = {
      exclude: [
        'created_by',
        'created_by_name',
        'created_by_email',
        'updated_by',
        'updated_by_name',
        'updated_by_email',
        'deleted_by',
        'deleted_by_name',
        'deleted_by_email'
      ]
    };
  }

  const interview = await Interview.findByPk(id, options);

  if (!interview) {
    throw new Error('Interview not found');
  }

  return interview;
};


/**
 * -------------------------
 * DELETE INTERVIEW (SOFT)
 * -------------------------
 */
const deleteInterview = async (
  id,
  deletedByMeta = {},
  { transaction: externalTx = null } = {}
) => {

  const tx = externalTx || await sequelize.transaction();

  try {

    await Interview.update({
      deleted_by: deletedByMeta.deleted_by || null,
      deleted_by_name: deletedByMeta.deleted_by_name || null,
      deleted_by_email: deletedByMeta.deleted_by_email || null,
    }, { where: { id }, transaction: tx });

    const interview = await Interview.findByPk(id, { transaction: tx });

    if (!interview) throw new Error('Interview not found');

    await interview.destroy({ transaction: tx });

    if (!externalTx) await tx.commit();

    return true;

  } catch (error) {
    if (!externalTx) await tx.rollback();
    throw error;
  }
};


/**
 * -------------------------
 * RESTORE INTERVIEW
 * -------------------------
 */
const restoreInterview = async (
  id,
  restoredByMeta = {},
  { transaction: externalTx = null } = {}
) => {

  const tx = externalTx || await sequelize.transaction();

  try {

    await Interview.restore({ where: { id }, transaction: tx });

    await Interview.update({
      deleted_by: null,
      deleted_by_name: null,
      deleted_by_email: null,
      updated_by: restoredByMeta.updated_by || null,
      updated_by_name: restoredByMeta.updated_by_name || null,
      updated_by_email: restoredByMeta.updated_by_email || null,
    }, { where: { id }, transaction: tx });

    const interview = await Interview.findByPk(id, { transaction: tx });

    if (!externalTx) await tx.commit();

    return interview;

  } catch (error) {
    if (!externalTx) await tx.rollback();
    throw error;
  }
};


export default {
  createInterview,
  updateInterview,
  verifyDocuments,
  updateInterviewStatus,
  getInterviews,
  getInterviewById,
  deleteInterview,
  restoreInterview
};
