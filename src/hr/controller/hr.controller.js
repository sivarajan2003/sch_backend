// hr.controller.js
import service from "../service/hr.service.js";
import dto from "../dto/hr.dto.js";

const createCandidate = async (req, res) => {
  try {
    const validated = dto.createCandidateSchema.parse(req.body);
    const data = await service.createCandidate(validated);
    res.json({ success: true, data });
  } catch (err) {
  console.log("BACKEND ERROR:", err); // ✅ ADD THIS LINE
  res.status(400).json({ message: err.message });
}
};

const getCandidates = async (req, res) => {
  try {
    const data = await service.getCandidates();
    res.json({ success: true, data });
  } catch (err) {
  console.log("BACKEND ERROR:", err); // ✅ ADD THIS LINE
  res.status(400).json({ message: err.message });
}
};

const selectCandidate = async (req, res) => {
  try {
    const data = await service.selectCandidate(req.params.id);
    res.json({ success: true, data });
  } catch (err) {
  console.log("BACKEND ERROR:", err); // ✅ ADD THIS LINE
  res.status(400).json({ message: err.message });
}
};
const updateCandidate = async (req, res) => {
  try {
    const data = await service.updateCandidate(req.params.id, req.body);
    res.json({ success: true, data });
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
};
const deleteCandidate = async (req, res) => {
  try {
    await service.deleteCandidate(req.params.id);
    res.json({ success: true });
  } catch (err) {
    console.log("DELETE ERROR:", err);
    res.status(400).json({ message: err.message });
  }
};

export default {
  createCandidate,
  getCandidates,
  selectCandidate,
   updateCandidate,   // ✅ ADD
  deleteCandidate    // ✅ ADD
};