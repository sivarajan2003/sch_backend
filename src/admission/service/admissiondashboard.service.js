import { Op, fn, col } from 'sequelize';
import Admission from '../models/admission.models.js';
import Class from '../../school/models/class.models.js';
import ClassAllocation from '../models/classallocation.models.js';

// Associations defined in associations.js

/* ======================================================
   DASHBOARD SUMMARY STATS
====================================================== */

const getDashboardStats = async () => {
  const [
    totalApplications,
    pendingDocuments,
    interviewsScheduled,
    enrolledStudents,
  ] = await Promise.all([
    Admission.count(),
    Admission.count({
      where: {
        [Op.or]: [
          { birth_certificate_status: { [Op.ne]: 'Verified' } },
          { tc_certificate_status: { [Op.ne]: 'Verified' } },
          { passport_size_photo_status: { [Op.ne]: 'Verified' } },
          { address_proof_status: { [Op.ne]: 'Verified' } },
        ],
      },
    }),
    Admission.count({
      where: {
        admission_status: 'Interview Scheduled',
      },
    }),
    Admission.count({
      where: {
        admission_status: 'Enrolled',
      },
    }),
  ]);

  return {
    totalApplications,
    pendingDocuments,
    interviewsScheduled,
    enrolledStudents,
  };
};

/* ======================================================
   ADMISSION FUNNEL
====================================================== */

const getAdmissionFunnel = async () => {
  const rows = await Admission.findAll({
    attributes: [
      'admission_status',
      [fn('COUNT', col('id')), 'count'],
    ],
    group: ['admission_status'],
  });

  const funnel = {};
  rows.forEach((r) => {
    funnel[r.admission_status] = Number(r.get('count'));
  });

  return funnel;
};

/* ======================================================
   CLASS CAPACITY
====================================================== */

const getClassCapacity = async () => {
  const classes = await Class.findAll({
    attributes: ['id', 'name', 'section', 'capacity'],
  });

  const allocations = await ClassAllocation.findAll({
    where: { is_active: true },
    attributes: [
      'class_id',
      [fn('COUNT', col('id')), 'allocated'],
    ],
    group: ['class_id'],
  });

  const allocationMap = {};
  allocations.forEach((a) => {
    allocationMap[a.class_id] = Number(a.get('allocated'));
  });

  return classes.map((cls) => {
    const allocated = allocationMap[cls.id] || 0;
    const total = cls.capacity || 0;

    return {
      class_id: cls.id,
      class_name: `${cls.name} ${cls.section || ''}`.trim(),
      total,
      allocated,
      available: total - allocated,
      percent: total
        ? Math.round((allocated / total) * 100)
        : 0,
    };
  });
};

/* ======================================================
   RECENT APPLICATIONS
====================================================== */

const getRecentApplications = async (limit = 5) => {
  const rows = await Admission.findAll({
    limit,
    order: [['createdAt', 'DESC']],
    include: [
      {
        model: Class,
        as: 'classDetails',
        attributes: ['name', 'section'],
      },
    ],
  });

  return rows.map((r) => ({
    id: r.id,
    student_name: r.student_name,
    admission_number: r.addmission_number,
    admission_status: r.admission_status,
    class_name: r.classDetails?.name || null,
    class_section: r.classDetails?.section || null,
    createdAt: r.createdAt,
  }));
};

/* ======================================================
   EXPORTS
====================================================== */

export default {
  getDashboardStats,
  getAdmissionFunnel,
  getClassCapacity,
  getRecentApplications,
};
