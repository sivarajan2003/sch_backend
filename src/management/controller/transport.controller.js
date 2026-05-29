//transport.controller.js
import transportService from "../service/transport.service.js";
const createTransport =
  async (req, res) => {
    try {
      const result =
        await transportService.create(
          req.body
        );

      res.status(201).json(result);

    } catch (error) {
  console.log("TRANSPORT CREATE ERROR:");
  console.log(error);

  res.status(500).json({
    message: error.message
  });
}
  };

const getTransport =
  async (req, res) => {
    try {
      const result =
        await transportService.getAll();

      res.json(result);

    } catch (error) {
  console.log("TRANSPORT GET ERROR:");
  console.log(error);

  res.status(500).json({
    message: error.message
  });
}
  };

const updateTransport =
  async (req, res) => {
    try {
      const result =
        await transportService.update(
          req.params.id,
          req.body
        );

      res.json(result);

    } catch (error) {
  console.log("TRANSPORT UPDATE ERROR:");
  console.log(error);

  res.status(500).json({
    message: error.message
  });
}
  };

const deleteTransport =
  async (req, res) => {
    try {
      await transportService.remove(
        req.params.id
      );

      res.json({
        message:
          "Deleted successfully"
      });

    } catch (error) {
  console.log("TRANSPORT DELETE ERROR:");
  console.log(error);

  res.status(500).json({
    message: error.message
  });
}
  };

export default {
  createTransport,
  getTransport,
  updateTransport,
  deleteTransport
};