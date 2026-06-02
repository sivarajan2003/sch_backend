//todo.service.js
import Todo from "../models/todo.models.js";

const getTodos = async () => {
  return await Todo.findAll({
    where: {
      is_active: true,
    },
    order: [["createdAt", "DESC"]],
  });
};

export default {
  getTodos,
};