import sportsService from "../service/sports.service.js";
import sportsDto from "../dto/sports.dto.js";

const createSports = async (req, res) => {
  try {
    const data = sportsDto(req.body);

    const result =
      await sportsService.create(data);

    res.status(201).json(result);

  } catch (error) {
    res.status(500).json({
      message: error.message,
    });
  }
};

const getSports = async (req, res) => {
  try {
    const result =
      await sportsService.getAll();

    res.json(result);

  } catch (error) {
    res.status(500).json({
      message: error.message,
    });
  }
};

const updateSports = async (req, res) => {
  try {
    const result =
      await sportsService.update(
        req.params.id,
        req.body
      );

    res.json(result);

  } catch (error) {
    res.status(500).json({
      message: error.message,
    });
  }
};

const deleteSports = async (req, res) => {
  try {
    await sportsService.remove(
      req.params.id
    );

    res.json({
      message: "Deleted successfully",
    });

  } catch (error) {
    res.status(500).json({
      message: error.message,
    });
  }
};

export default {
  createSports,
  getSports,
  updateSports,
  deleteSports,
};