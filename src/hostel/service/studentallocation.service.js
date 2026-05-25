import StudentAllocation from '../models/studentallocation.models.js';
const createAllocation = async (
  payload
) => {

  const count =
    await StudentAllocation.count();

  return await StudentAllocation.create({
    ...payload,

    allocation_id: `AL${1001 + count}`,

    initial: payload.student
      .split(' ')
      .map((n) => n[0])
      .join(''),

    color: 'blue',
  });
};

const getAllocations = async () => {

  return await StudentAllocation.findAll({
    order: [['createdAt', 'DESC']],
  });
};

const updateAllocation = async (
  id,
  payload
) => {

  const item =
    await StudentAllocation.findByPk(id);

  if (!item) {
    throw new Error(
      'Allocation not found'
    );
  }

  await item.update(payload);

  return item;
};

const deleteAllocation = async (
  id
) => {

  const item =
    await StudentAllocation.findByPk(id);

  if (!item) {
    throw new Error(
      'Allocation not found'
    );
  }

  await item.destroy();

  return true;
};

export default {
  createAllocation,
  getAllocations,
  updateAllocation,
  deleteAllocation,
};