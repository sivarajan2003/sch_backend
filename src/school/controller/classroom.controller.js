import Classroom from '../models/classroom.models.js';

const getClassrooms = async (req, res) => {
  try {
    const rows = await Classroom.findAll({ order: [['createdAt', 'DESC']] });
    return res.status(200).json({ success: true, rows });
  } catch (err) {
    return res.status(500).json({ success: false, message: err.message });
  }
};

const createClassroom = async (req, res) => {
  try {
    const payload = req.body;
    if (req.user) {
      payload.created_by = req.user.id;
      payload.created_by_name = req.user.name;
    }
    const room = await Classroom.create(payload);
    return res.status(201).json({ success: true, data: room });
  } catch (err) {
    return res.status(500).json({ success: false, message: err.message });
  }
};

const updateClassroom = async (req, res) => {
  try {
    const payload = req.body;
    if (req.user) {
      payload.updated_by = req.user.id;
      payload.updated_by_name = req.user.name;
    }
    const [updated] = await Classroom.update(payload, { where: { id: req.params.id } });
    if (updated === 0) return res.status(404).json({ success: false, message: 'Classroom not found' });
    const room = await Classroom.findByPk(req.params.id);
    return res.status(200).json({ success: true, data: room });
  } catch (err) {
    return res.status(500).json({ success: false, message: err.message });
  }
};

const deleteClassroom = async (req, res) => {
  try {
    const room = await Classroom.findByPk(req.params.id);
    if (!room) return res.status(404).json({ success: false, message: 'Classroom not found' });
    await room.destroy();
    return res.status(200).json({ success: true, message: 'Deleted successfully' });
  } catch (err) {
    return res.status(500).json({ success: false, message: err.message });
  }
};

export default { getClassrooms, createClassroom, updateClassroom, deleteClassroom };
