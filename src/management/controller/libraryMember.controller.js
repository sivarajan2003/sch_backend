import memberService from '../service/libraryMember.service.js';

const createMember = async (req, res) => {

  const result =
    await memberService.createMember(
      req.body
    );

  return res.status(201).json({
    success: true,
    data: result
  });
};

const getMembers = async (req, res) => {

  const result =
    await memberService.getMembers();

  return res.status(200).json({
    success: true,
    data: result
  });
};

const updateMember = async (req, res) => {

  const result =
    await memberService.updateMember(
      req.params.id,
      req.body
    );

  return res.status(200).json({
    success: true,
    data: result
  });
};

const deleteMember = async (req, res) => {

  await memberService.deleteMember(
    req.params.id
  );

  return res.status(200).json({
    success: true
  });
};

export default {
  createMember,
  getMembers,
  updateMember,
  deleteMember
};