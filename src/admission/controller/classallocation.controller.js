import classAllocationService from '../service/classallocation.service.js';
import dto from '../dto/classallocation.dto.js';

/* ============================
   CREATE CLASS ALLOCATION
============================ */

const createClassAllocation = async (req, res) => {
  try {
    const payload = dto.createClassAllocationSchema.parse(req.body);

    if (req.user?.id) {
      payload.created_by = req.user.id;
      payload.created_by_name = req.user.name || null;
      payload.created_by_email = req.user.email || null;
    }

    const allocation =
      await classAllocationService.allocateClass(payload);

    return res.status(201).json({
      success: true,
      data: allocation,
    });
  } catch (err) {
    console.error('createClassAllocation error:', err?.message);

    if (err?.name === 'ZodError') {
      return res.status(400).json({
        success: false,
        errors: err.errors,
      });
    }

    return res.status(500).json({
      success: false,
      message: err.message || 'Server error',
    });
  }
};

/* ============================
   REALLOCATE CLASS
============================ */

const reallocateClass = async (req, res) => {
  try {
    const payload = dto.reallocateClassSchema.parse(req.body);

    const updatedMeta = {};

    if (req.user) {
      updatedMeta.updated_by = req.user.id;
      updatedMeta.updated_by_name = req.user.name;
      updatedMeta.updated_by_email = req.user.email;
    }

    const allocation =
      await classAllocationService.reallocateClass(
        payload.admission_id,
        payload.new_class_id,
        updatedMeta
      );

    return res.status(200).json({
      success: true,
      data: allocation,
    });
  } catch (err) {
    console.error('reallocateClass error:', err?.message);

    if (err?.name === 'ZodError') {
      return res.status(400).json({
        success: false,
        errors: err.errors,
      });
    }

    return res.status(500).json({
      success: false,
      message: err.message || 'Server error',
    });
  }
};

/* ============================
   DEACTIVATE ALLOCATION
============================ */

const deactivateClassAllocation = async (req, res) => {
  try {
    const { id } = req.params;
    const payload = dto.deactivateClassAllocationSchema.parse(req.body);

    const allocation =
      await classAllocationService.deactivateAllocation(
        id,
        payload
      );

    return res.status(200).json({
      success: true,
      message: 'Class allocation deactivated',
      data: allocation,
    });
  } catch (err) {
    console.error('deactivateClassAllocation error:', err?.message);

    if (err?.name === 'ZodError') {
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
   GET ALLOCATION BY ADMISSION
============================ */

const getAllocationByAdmission = async (req, res) => {
  try {
    const { admission_id } =
      dto.getAllocationByAdmissionSchema.parse(req.params);

    const allocation =
      await classAllocationService.getAllocationByAdmission(
        admission_id
      );

    return res.status(200).json({
      success: true,
      data: allocation,
    });
  } catch (err) {
    console.error('getAllocationByAdmission error:', err?.message);

    if (err?.name === 'ZodError') {
      return res.status(400).json({
        success: false,
        errors: err.errors,
      });
    }

    return res.status(500).json({
      success: false,
      message: err.message || 'Server error',
    });
  }
};

/* ============================
   LIST CLASS ALLOCATIONS
============================ */

const getClassAllocations = async (req, res) => {
  try {
    const {
      page = 1,
      limit = 10,
      filters,
      order,
    } = dto.filterClassAllocationSchema.parse(req.query);

    let parsedFilters = filters;

    if (typeof filters === 'string') {
      parsedFilters = JSON.parse(filters);
    }

    let parsedOrder = order;
    if (typeof order === 'string') {
      parsedOrder = JSON.parse(order);
    }

    const result =
      await classAllocationService.getClassAllocations({
        page,
        limit,
        filters: parsedFilters,
        order: parsedOrder,
      });

    return res.status(200).json({
      success: true,
      ...result,
    });
  } catch (err) {
    console.error('getClassAllocations error:', err?.message);

    if (err?.name === 'ZodError') {
      return res.status(400).json({
        success: false,
        errors: err.errors,
      });
    }

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
  createClassAllocation,
  reallocateClass,
  deactivateClassAllocation,
  getAllocationByAdmission,
  getClassAllocations,
};
