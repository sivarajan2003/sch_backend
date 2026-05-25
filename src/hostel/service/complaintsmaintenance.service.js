import ComplaintsMaintenance from '../models/complaintsmaintenance.models.js';

const createComplaint = async (payload) => {
  const count =
    await ComplaintsMaintenance.count();

  const complaint =
    await ComplaintsMaintenance.create({
      ...payload,

      complaint_id: `CMP-${1001 + count}`,

      color:
        payload.priority === 'High'
          ? 'red'
          : payload.priority === 'Medium'
          ? 'orange'
          : 'green',
    });

  return complaint;
};

const getComplaints = async () => {
  return await ComplaintsMaintenance.findAll({
    order: [['createdAt', 'DESC']],
  });
};

const getComplaintById = async (id) => {
  return await ComplaintsMaintenance.findByPk(
    id
  );
};

const updateComplaint = async (
  id,
  payload
) => {
  await ComplaintsMaintenance.update(
    payload,
    {
      where: { id },
    }
  );

  return await ComplaintsMaintenance.findByPk(
    id
  );
};

const deleteComplaint = async (id) => {
  return await ComplaintsMaintenance.destroy({
    where: { id },
  });
};

export default {
  createComplaint,
  getComplaints,
  getComplaintById,
  updateComplaint,
  deleteComplaint,
};