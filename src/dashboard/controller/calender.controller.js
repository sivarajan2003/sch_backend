import calendarService from "../service/calendar.service.js";

const getEvents = async (req, res) => {
  try {
    const events =
      await calendarService.getEvents();

    return res.status(200).json({
      success: true,
      data: events,
    });
  } catch (err) {
    return res.status(500).json({
      success: false,
      message: err.message,
    });
  }
};
const createEvent = async (req, res) => {
  try {
    const data = await calendarService.createEvent(req.body);

    return res.status(201).json({
      success: true,
      data,
    });
  } catch (err) {
    return res.status(500).json({
      success: false,
      message: err.message,
    });
  }
};

export default {
  getEvents,
  createEvent,
};