import UpcomingEvent from "../models/upcomingevent.models.js";

const getUpcomingEvents = async () => {
  return await UpcomingEvent.findAll({
    order: [["event_date", "ASC"]],
  });
};

const createUpcomingEvent = async (
  payload
) => {
  return await UpcomingEvent.create(payload);
};

export default {
  getUpcomingEvents,
  createUpcomingEvent,
};