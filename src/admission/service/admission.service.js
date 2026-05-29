// admission.service.js
import { sequelize } from '../../db/index.js';
import { Op } from 'sequelize';
import bcrypt from 'bcrypt';
import AdminUser from '../../adminuser/models/adminuser.model.js';
import Admission from '../models/admission.models.js';
import Class from '../../school/models/class.models.js';
import feepaymentService from './feepayment.service.js';
import classAllocationService from './classallocation.service.js';

// Association is defined in associations.js — do not redefine here

/* ======================================================
   CREATE ADMISSION (WITH FEE PAYMENT)
====================================================== */

const createAdmission = async (
  payload,
  { transaction: externalTx = null } = {}
) => {
  const tx = externalTx || await sequelize.transaction();

  try {
    /* =============================
       1️⃣ Normalize parent data
    ============================== */
    const parentEmail = payload.parent_email
      ? String(payload.parent_email).toLowerCase()
      : null;

    const parentPhone = payload.parent_number || null;
    const parentName = payload.parent_name || 'Parent';

    let adminUser = null;

    /* =============================
       2️⃣ Find or Create Parent User
    ============================== */
    if (parentEmail) {
      adminUser = await AdminUser.findOne({
        where: { email: parentEmail },
        transaction: tx,
        paranoid: false,
      });
    }

    if (!adminUser && parentEmail && parentPhone) {
      const hashedPassword = await bcrypt.hash(String(parentPhone), 10);

      adminUser = await AdminUser.create(
        {
          username: parentName,
          email: parentEmail,
          phone: parentPhone,
          password: hashedPassword,
          role: 'Parent',
          is_active: payload.is_active ?? true,
          created_by: payload.created_by ?? null,
          created_by_name: payload.created_by_name ?? null,
          created_by_email: payload.created_by_email ?? null,
        },
        { transaction: tx }
      );
    }

    /* =============================
       3️⃣ Extract Fee Fields
    ============================== */
    const {
      registration_fee,
      total_amount,
      payment_method,
      payment_date,
      payment_status,
      receipt_no,
      fee_remark,
      ...admissionPayload
    } = payload;

    if (adminUser?.id && Admission.rawAttributes?.parent_user_id) {
      admissionPayload.parent_user_id = adminUser.id;
    }

    /* =============================
       4️⃣ Create Admission
    ============================== */
    const admission = await Admission.create(admissionPayload, {
      transaction: tx,
    });

    /* =============================
       5️⃣ Create Fee Payment
    ============================== */
    let feePayment = null;

    const hasFeeData =
      registration_fee !== undefined &&
      total_amount !== undefined &&
      payment_method &&
      payment_date;

    if (hasFeeData) {
      feePayment = await feepaymentService.createFeePayment(
        {
          admission_id: admission.id,
          registration_fee,
          total_amount,
          payment_method,
          payment_date,
          payment_status: payment_status || 'Completed',
          receipt_no: receipt_no || null,
          remark: fee_remark || null,
          is_active: true,
          created_by: payload.created_by ?? null,
          created_by_name: payload.created_by_name ?? null,
          created_by_email: payload.created_by_email ?? null,
        },
        { transaction: tx } // 🔥 SAME TRANSACTION
      );
    }

    /* =============================
       6️⃣ Commit
    ============================== */
    if (!externalTx) await tx.commit();

    return {
      admission,
      feePayment,
      parent_user_id: adminUser?.id || null,
    };
  } catch (err) {
    if (!externalTx) await tx.rollback();
    throw err;
  }
};


/* ======================================================
   UPDATE ADMISSION
====================================================== */

const updateAdmission = async (
  id,
  payload,
  { transaction: externalTx = null } = {}
) => {
  const tx = externalTx || await sequelize.transaction();

  try {
    // 1️⃣ Fetch existing admission
    const admission = await Admission.findByPk(id, { transaction: tx });
    if (!admission) throw new Error('Admission not found');

    const previousStatus = admission.admission_status;

    // 2️⃣ Update admission
    await admission.update(payload, { transaction: tx });

    // 3️⃣ AUTO CLASS ALLOCATION ON ENROLLED
    if (
      payload.admission_status === 'Enrolled' &&
      previousStatus !== 'Enrolled'
    ) {
      if (!admission.class_applied_id) {
        throw new Error('Class not selected for allocation');
      }

      // 🔎 Check existing active allocation
      const existingAllocation =
        await classAllocationService.getAllocationByAdmission(
          admission.id,
          { transaction: tx }
        );

      if (!existingAllocation) {
        await classAllocationService.allocateClass(
          {
            admission_id: admission.id,
            class_id: admission.class_applied_id,
            allocated_by: payload.updated_by ?? null,
            created_by: payload.updated_by ?? null,
            created_by_name: payload.updated_by_name ?? null,
            created_by_email: payload.updated_by_email ?? null,
          },
          { transaction: tx } // 🔥 SAME TX
        );
      }
    }

    if (!externalTx) await tx.commit();
    return admission;
  } catch (err) {
    if (!externalTx) await tx.rollback();
    throw err;
  }
};


/* ======================================================
   FILTER / LIST ADMISSIONS
====================================================== */

const buildWhere = ({ filters = {}, search, startDate, endDate } = {}) => {
  const where = {};

  Object.entries(filters || {}).forEach(([key, val]) => {
    if (val !== undefined && val !== null) {
      where[key] = Array.isArray(val) ? { [Op.in]: val } : val;
    }
  });

  if (startDate || endDate) {
    where.createdAt = {};
    if (startDate) where.createdAt[Op.gte] = new Date(startDate);
    if (endDate) where.createdAt[Op.lte] = new Date(endDate);
  }

if (search) {
  const like =
    sequelize.getDialect() === "postgres" ? Op.iLike : Op.like;

  where[Op.or] = [
    { student_name: { [like]: `%${search}%` } },
    { addmission_number: { [like]: `%${search}%` } },
    { parent_name: { [like]: `%${search}%` } },
    { parent_email: { [like]: `%${search}%` } },
    { parent_number: { [like]: `%${search}%` } }, // optional improvement
  ];
}

  return where;
};

const getAdmissions = async ({
  page = 1,
  limit = 10,
  filters,
  search,
  startDate,
  endDate,
  order = [['createdAt', 'DESC']],
} = {}) => {
  const where = buildWhere({ filters, search, startDate, endDate });

  const { count, rows } = await Admission.findAndCountAll({
    where,
    order,
    offset: (page - 1) * limit,
    limit: Number(limit),
    include: [
      {
        model: Class,
        as: 'classDetails',
        attributes: ['name', 'section'],
      },
    ],
  });

  return {
    count,
    rows: rows.map(r => ({
      ...r.toJSON(),
      class_name: r.classDetails?.name || null,
      class_section: r.classDetails?.section || null,
    })),
    page,
    limit,
    totalPages: Math.ceil(count / limit),
  };
};

/* ======================================================
   GET BY ID
====================================================== */

const getAdmissionById = async (id) => {
  const admission = await Admission.findByPk(id);
  if (!admission) throw new Error('Admission not found');
  return admission;
};

/* ======================================================
   VERIFY DOCUMENTS
====================================================== */

const verifyAdmissionDocuments = async (
  admissionId,
  documentPayload,
  verifiedByMeta = {},
  { transaction: externalTx = null } = {}
) => {
  const tx = externalTx || await sequelize.transaction();

  try {
    const admission = await Admission.findByPk(admissionId, { transaction: tx });
    if (!admission) throw new Error('Admission not found');

    await admission.update(
      {
        ...documentPayload,
        updated_by: verifiedByMeta.updated_by ?? null,
        updated_by_name: verifiedByMeta.updated_by_name ?? null,
        updated_by_email: verifiedByMeta.updated_by_email ?? null,
      },
      { transaction: tx }
    );

    if (!externalTx) await tx.commit();
    return admission;
  } catch (err) {
    if (!externalTx) await tx.rollback();
    throw err;
  }
};

/* ======================================================
   EXPORTS
====================================================== */

export default {
  createAdmission,
  updateAdmission,
  getAdmissions,
  getAdmissionById,
  verifyAdmissionDocuments,
};
