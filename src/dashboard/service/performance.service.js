//performance.service.js
import Performance from "../models/performance.models.js";

const getAllPerformance = async () => {
  return await Performance.findAll({
    order: [["class_name", "ASC"]],
  });
};

const getPerformanceByClass = async (
  className
) => {
  return await Performance.findOne({
    where: {
      class_name: className,
    },
  });
};

const createPerformance = async (
  payload
) => {
  return await Performance.create(payload);
};

export default {
  getAllPerformance,
  getPerformanceByClass,
  createPerformance,
};