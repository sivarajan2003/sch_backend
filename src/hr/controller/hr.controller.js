import service from "../service/hr.service.js";

const createCandidate = async (req, res) => {
  try {
    const data = await service.createCandidate(req.body);
    res.json({ success: true, data });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

const getCandidates = async (req, res) => {
  try {
    const data = await service.getCandidates();
    res.json({ success: true, data });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

const selectCandidate = async (req, res) => {
  try {
    const data = await service.selectCandidate(req.params.id);
    res.json({ success: true, data });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

export default {
  createCandidate,
  getCandidates,
  selectCandidate
};