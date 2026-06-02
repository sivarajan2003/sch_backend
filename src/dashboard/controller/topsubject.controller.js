//topsubject.controller.js
import service from "../service/topsubject.service.js";

const getTopSubjects = async (req, res) => {
  try {
    const data = await service.getTopSubjects();

    const result = data.map((item, index) => ({
      id: item.id,
      name: item.name,
      percentage: 100 - index * 10,
    }));

    res.status(200).json({
      success: true,
      data: result,
    });
  } catch (err) {
    res.status(500).json({
      success: false,
      message: err.message,
    });
  }
};

export default {
  getTopSubjects,
};