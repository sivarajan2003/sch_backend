//event.controller.js
import service from "../service/event.service.js";

const getUpcomingEvents = async (req, res) => {
  try {
    const data =
      await service.getUpcomingEvents();

    res.status(200).json({
      success: true,
      data,
    });

  } catch (err) {

    res.status(500).json({
      success: false,
      message: err.message,
    });

  }
};

export default {
  getUpcomingEvents,
};