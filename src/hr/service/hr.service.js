//hr.service.js
import HR from "../models/hr.model.js";

// CREATE
const createCandidate = async (data) => {
  return await HR.create(data);
};

// GET
const getCandidates = async () => {
  return await HR.findAll({
    order: [["createdAt", "DESC"]],
  });
};


// SELECT
const selectCandidate = async (id) => {
  const candidate = await HR.findByPk(id);

  if (!candidate) throw new Error("Candidate not found");

  await candidate.update({
    status: "Selected",
  });

  return candidate;
};
const updateCandidate = async (id, payload) => {
  const candidate = await HR.findByPk(id);

  if (!candidate) throw new Error("Candidate not found");

  await candidate.update(payload);
  return candidate;
};
const deleteCandidate = async (id) => {
  const candidate = await HR.findByPk(id);

  if (!candidate) throw new Error("Candidate not found");

  await candidate.destroy();
  return true;
};

export default {
  createCandidate,
  getCandidates,
  selectCandidate,
  updateCandidate,   // ✅ ADD
  deleteCandidate
};