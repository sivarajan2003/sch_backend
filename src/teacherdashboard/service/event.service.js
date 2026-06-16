//event.service.js
import Event from "../models/event.models.js";
import { Op } from "sequelize";
const getUpcomingEvents = async () => {
  const today = new Date();

  return await Event.findAll({
    where: {
      event_date: {
        [Op.gte]: today,
      },
    },
    order: [["event_date", "ASC"]],
  });
};

export default {
  getUpcomingEvents,
};