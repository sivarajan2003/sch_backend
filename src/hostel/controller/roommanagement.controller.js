//roommanagement.controller.js
import roomService from '../service/roommanagement.service.js';

const createRoom = async (req, res) => {
  try {
    const room =
      await roomService.createRoom(req.body);

    return res.status(201).json({
      success: true,
      data: room,
    });
  } catch (err) {
    return res.status(500).json({
      success: false,
      message: err.message,
    });
  }
};

const getRooms = async (req, res) => {
  try {
    const rooms =
      await roomService.getRooms();

    return res.status(200).json({
      success: true,
      rows: rooms,
    });
  } catch (err) {
    return res.status(500).json({
      success: false,
      message: err.message,
    });
  }
};

const getRoomById = async (req, res) => {
  try {
    const room =
      await roomService.getRoomById(
        req.params.id
      );

    return res.status(200).json({
      success: true,
      data: room,
    });
  } catch (err) {
    return res.status(500).json({
      success: false,
      message: err.message,
    });
  }
};

const updateRoom = async (req, res) => {
  try {
    const room =
      await roomService.updateRoom(
        req.params.id,
        req.body
      );

    return res.status(200).json({
      success: true,
      data: room,
    });
  } catch (err) {
    return res.status(500).json({
      success: false,
      message: err.message,
    });
  }
};

const deleteRoom = async (req, res) => {
  try {
    await roomService.deleteRoom(
      req.params.id
    );

    return res.status(200).json({
      success: true,
      message: 'Room deleted',
    });
  } catch (err) {
    return res.status(500).json({
      success: false,
      message: err.message,
    });
  }
};

export default {
  createRoom,
  getRooms,
  getRoomById,
  updateRoom,
  deleteRoom,
};