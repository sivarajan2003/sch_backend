//calender.service.js
//import CalendarEvent from "../models/calender.models.js";
import Holiday from "../../holiday/models/holiday.model.js";
const getEvents = async () => {
  return await Holiday.findAll({
    order: [["from_date", "ASC"]],
  });
};
const createEvent = async (payload) => {
  return await CalendarEvent.create(payload);
};

export default {
  getEvents,
  createEvent,
};