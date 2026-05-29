import { sequelize } from '../../db/index.js';
import { Op } from 'sequelize';
import ClassAllocation from '../models/classallocation.models.js';
import Admission from '../../admission/models/admission.models.js';
import Class from '../../school/models/class.models.js';

// Associations defined in associations.js

/* ======================================================
   ALLOCATE CLASS
====================================================== */

const allocateClass = async (
  payload,
  { transaction: externalTx = null } = {}
) => {
  const tx = externalTx || await sequelize.transaction();

  try {
    const {
      admission_id,
      class_id,
      allocated_by,
      created_by,
      created_by_name,
      created_by_email,
    } = payload;

    // 🔎 Check existing active allocation
    const existing = await ClassAllocation.findOne({
      where: {
        admission_id,
        is_active: true,
      },
      transaction: tx,
    });

    if (existing) {
      throw new Error('Class already allocated to this admission');
    }

    const allocation = await ClassAllocation.create(
      {
        admission_id,
        class_id,
        allocated_by,
        is_active: true,
        created_by,
        created_by_name,
        created_by_email,
      },
      { transaction: tx }
    );

    if (!externalTx) await tx.commit();
    return allocation;
  } catch (err) {
    if (!externalTx) await tx.rollback();
    throw err;
  }
};

/* ======================================================
   REALLOCATE / CHANGE CLASS
====================================================== */

const reallocateClass = async (
  admission_id,
  new_class_id,
  updatedMeta = {},
  { transaction: externalTx = null } = {}
) => {
  const tx = externalTx || await sequelize.transaction();

  try {
    // 1️⃣ Deactivate old allocation
    await ClassAllocation.update(
      {
        is_active: false,
        updated_by: updatedMeta.updated_by ?? null,
        updated_by_name: updatedMeta.updated_by_name ?? null,
        updated_by_email: updatedMeta.updated_by_email ?? null,
      },
      {
        where: {
          admission_id,
          is_active: true,
        },
        transaction: tx,
      }
    );

    // 2️⃣ Create new allocation
    const allocation = await ClassAllocation.create(
      {
        admission_id,
        class_id: new_class_id,
        allocated_by: updatedMeta.updated_by ?? null,
        is_active: true,
        created_by: updatedMeta.updated_by ?? null,
        created_by_name: updatedMeta.updated_by_name ?? null,
        created_by_email: updatedMeta.updated_by_email ?? null,
      },
      { transaction: tx }
    );

    if (!externalTx) await tx.commit();
    return allocation;
  } catch (err) {
    if (!externalTx) await tx.rollback();
    throw err;
  }
};

/* ======================================================
   DEACTIVATE ALLOCATION
====================================================== */

const deactivateAllocation = async (
  id,
  deletedMeta = {},
  { transaction: externalTx = null } = {}
) => {
  const tx = externalTx || await sequelize.transaction();

  try {
    const allocation = await ClassAllocation.findByPk(id, {
      transaction: tx,
    });

    if (!allocation) throw new Error('Allocation not found');

    await allocation.update(
      {
        is_active: false,
        deleted_by: deletedMeta.deleted_by ?? null,
        deleted_by_name: deletedMeta.deleted_by_name ?? null,
        deleted_by_email: deletedMeta.deleted_by_email ?? null,
      },
      { transaction: tx }
    );

    if (!externalTx) await tx.commit();
    return allocation;
  } catch (err) {
    if (!externalTx) await tx.rollback();
    throw err;
  }
};

/* ======================================================
   GET BY ADMISSION ID
====================================================== */

const getAllocationByAdmission = async (admission_id) => {
  return await ClassAllocation.findOne({
    where: {
      admission_id,
      is_active: true,
    },
    include: [
      {
        model: Class,
        as: 'class',
        attributes: ['id', 'name', 'section'],
      },
    ],
  });
};

/* ======================================================
   LIST / FILTER CLASS ALLOCATIONS
====================================================== */

const getClassAllocations = async ({
  page = 1,
  limit = 10,
  filters = {},
  order = [['createdAt', 'DESC']],
} = {}) => {
  const where = {};

  Object.entries(filters).forEach(([key, val]) => {
    if (val !== undefined && val !== null) {
      where[key] = Array.isArray(val) ? { [Op.in]: val } : val;
    }
  });

  const { count, rows } = await ClassAllocation.findAndCountAll({
    where,
    order,
    offset: (page - 1) * limit,
    limit: Number(limit),
    include: [
      {
        model: Class,
        as: 'class',
        attributes: ['name', 'section'],
      },
      {
        model: Admission,
        as: 'admission',
        attributes: ['student_name', 'addmission_number'],
      },
    ],
  });

  return {
    count,
    rows,
    page,
    limit,
    totalPages: Math.ceil(count / limit),
  };
};

/* ======================================================
   EXPORTS
====================================================== */

export default {
  allocateClass,
  reallocateClass,
  deactivateAllocation,
  getAllocationByAdmission,
  getClassAllocations,
};
