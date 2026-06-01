import CalendarEvent from "../models/calendar.model.js";

const getEvents = async () => {
  return await CalendarEvent.findAll({
    order: [["event_date", "ASC"]],
  });
};

const createEvent = async (payload) => {
  return await CalendarEvent.create(payload);
};

export default {
  getEvents,
  createEvent,
};