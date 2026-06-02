//studentactivity.service.js
import StudentActivity
from "../models/studentactivity.models.js";

const getActivities = async () => {
  return await StudentActivity.findAll({
    where: {
      is_active: true,
    },
    order: [["createdAt", "DESC"]],
  });
};

export default {
  getActivities,
};