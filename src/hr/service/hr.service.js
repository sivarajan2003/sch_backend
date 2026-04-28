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

export default {
  createCandidate,
  getCandidates,
  selectCandidate,
};