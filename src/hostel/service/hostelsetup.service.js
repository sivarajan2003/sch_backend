//hostelsetup.service.js
import HostelSetup from '../models/hostelsetup.models.js';

const createHostel = async (payload) => {
  const count = await HostelSetup.count();

  const hostel = await HostelSetup.create({
    ...payload,
    hostel_id: `HS${1001 + count}`,
  });

  return hostel;
};

const getHostels = async () => {
  return await HostelSetup.findAll({
    order: [['createdAt', 'DESC']],
  });
};

const getHostelById = async (id) => {
  return await HostelSetup.findByPk(id);
};

const updateHostel = async (id, payload) => {
  await HostelSetup.update(payload, {
    where: { id },
  });

  return await HostelSetup.findByPk(id);
};

const deleteHostel = async (id) => {
  const hostel = await HostelSetup.findByPk(id);

  if (!hostel) {
    throw new Error('Hostel not found');
  }

  await hostel.destroy();

  return true;
};

export default {
  createHostel,
  getHostels,
  getHostelById,
  updateHostel,
  deleteHostel,
};