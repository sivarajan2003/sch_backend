// todo.controller.js
import service from "../service/todo.service.js";

const getTodos = async (req, res) => {
  try {
    const data = await service.getTodos();

    res.status(200).json({
      success: true,
      data,
    });
  } catch (err) {
    res.status(500).json({
      success: false,
      message: err.message,
    });
  }
};

export default {
  getTodos,
};