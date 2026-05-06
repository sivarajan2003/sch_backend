//hr.service.js
import HR from "../models/hr.model.js";
import Teacher from "../models/teacher.model.js";
//import Teacher from "../models/teacher.model.js";
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

  if (!candidate) {
    throw new Error("Candidate not found");
  }

  console.log("Candidate found:", candidate.name);

  // update candidate status
  await candidate.update({
    status: "Selected",
  });

  // add into teacher table
  const teacher = await Teacher.create({
    name: candidate.name,
    email: candidate.email,
    qualification: candidate.qualification,
    phone: candidate.phone,
    status: "Active",
  });

  console.log("Teacher inserted:", teacher);

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