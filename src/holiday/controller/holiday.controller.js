import holidayService from "../service/holiday.service.js";
import holidayDto from "../dto/holiday.dto.js";

const createHoliday = async (req, res) => {
  try {
    const validated =
      holidayDto.createHolidaySchema.parse(req.body);

    const result =
      await holidayService.createHoliday(validated);

    res.status(201).json({
      success: true,
      data: result
    });

  } catch (error) {
    res.status(400).json({
      success: false,
      message: error.message
    });
  }
};

const getHoliday = async (req, res) => {
  const result =
    await holidayService.getHoliday();

  res.status(200).json({
    success: true,
    data: result
  });
};

const updateHoliday = async (req, res) => {
  const result =
    await holidayService.updateHoliday(
      req.params.id,
      req.body
    );

  if (!result) {
    return res.status(404).json({
      success: false,
      message: "Holiday not found"
    });
  }

  res.status(200).json({
    success: true,
    data: result
  });
};

const deleteHoliday = async (req, res) => {
  const result =
    await holidayService.deleteHoliday(
      req.params.id
    );

  if (!result) {
    return res.status(404).json({
      success: false,
      message: "Holiday not found"
    });
  }

  res.status(200).json({
    success: true,
    data: result
  });
};

export default {
  createHoliday,
  getHoliday,
  updateHoliday,
  deleteHoliday
};