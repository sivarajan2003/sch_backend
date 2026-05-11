import LibraryMember from '../models/libraryMember.model.js';

const createMember = async (payload) => {
  return await LibraryMember.create(payload);
};

const getMembers = async () => {
  return await LibraryMember.findAll();
};

const updateMember = async (id, payload) => {

  await LibraryMember.update(
    payload,
    {
      where: { id }
    }
  );

  return await LibraryMember.findByPk(id);
};

const deleteMember = async (id) => {
  return await LibraryMember.destroy({
    where: { id }
  });
};

export default {
  createMember,
  getMembers,
  updateMember,
  deleteMember
};