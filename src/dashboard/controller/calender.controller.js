import calendarService from "../service/calender.service.js";

const getEvents = async (req, res) => {
  try {
    const holidays =
  await calendarService.getEvents();

    return res.status(200).json({
  success: true,
  data: holidays.map((h) => ({
    id: h.id,
    title: h.title,
    event_type: "Holiday",
    event_date: h.from_date,
    description: h.description,
  })),
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