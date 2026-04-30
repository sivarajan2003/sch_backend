//hr.controller.js
import service from "../service/hr.service.js";
import dto from "../dto/hr.dto.js";

/* ================= CREATE ================= */
const createCandidate = async (req, res) => {
  try {
    const validated = dto.createCandidateSchema.parse(req.body);
    const data = await service.createCandidate(validated);

    res.json({ success: true, data });

  } catch (err) {
    console.log("BACKEND ERROR:", err);

    // ✅ ZOD ERROR HANDLING
    if (err.errors) {
      const messages = err.errors.map(e => e.message);

      return res.status(400).json({
        success: false,
        message: messages[0],
        errors: messages
      });
    }

    res.status(400).json({
      success: false,
      message: err.message || "Something went wrong"
    });
  }
};

/* ================= GET ================= */
const getCandidates = async (req, res) => {
  try {
    const data = await service.getCandidates();
    res.json({ success: true, data });

  } catch (err) {
    console.log("BACKEND ERROR:", err);

    res.status(400).json({
      success: false,
      message: err.message || "Failed to fetch candidates"
    });
  }
};

/* ================= SELECT ================= */
const selectCandidate = async (req, res) => {
  try {
    const data = await service.selectCandidate(req.params.id);
    res.json({ success: true, data });

  } catch (err) {
    console.log("BACKEND ERROR:", err);

    res.status(400).json({
      success: false,
      message: err.message || "Selection failed"
    });
  }
};

/* ================= UPDATE ================= */
const updateCandidate = async (req, res) => {
  try {
    const data = await service.updateCandidate(req.params.id, req.body);
    res.json({ success: true, data });

  } catch (err) {
    console.log("UPDATE ERROR:", err);

    res.status(400).json({
      success: false,
      message: err.message || "Update failed"
    });
  }
};

/* ================= DELETE ================= */
const deleteCandidate = async (req, res) => {
  try {
    await service.deleteCandidate(req.params.id);
    res.json({ success: true });

  } catch (err) {
    console.log("DELETE ERROR:", err);

    res.status(400).json({
      success: false,
      message: err.message || "Delete failed"
    });
  }
};

export default {
  createCandidate,
  getCandidates,
  selectCandidate,
  updateCandidate,
  deleteCandidate
};