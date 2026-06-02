//upcomingevent.controller.js
import upcomingEventService from "../service/upcomingevent.service.js";

const getUpcomingEvents = async (req, res) => {
  try {
    const data =
      await upcomingEventService.getUpcomingEvents();

    return res.status(200).json({
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

const createUpcomingEvent = async (req, res) => {
  try {
    const data =
      await upcomingEventService.createUpcomingEvent(
        req.body
      );

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
  getUpcomingEvents,
  createUpcomingEvent,
};