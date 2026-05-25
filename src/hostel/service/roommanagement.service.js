//roommanagement.service.js
import RoomManagement from '../models/roommanagement.models.js';

const createRoom = async (payload) => {
  const count = await RoomManagement.count();

  const room = await RoomManagement.create({
    ...payload,
    room_id: `RM${1001 + count}`,
  });

  return room;
};

const getRooms = async () => {
  return await RoomManagement.findAll({
    order: [['createdAt', 'DESC']],
  });
};

const getRoomById = async (id) => {
  return await RoomManagement.findByPk(id);
};

const updateRoom = async (id, payload) => {
  const room =
    await RoomManagement.findByPk(id);

  if (!room) {
    throw new Error('Room not found');
  }

  await room.update(payload);

  return room;
};

const deleteRoom = async (id) => {
  const room =
    await RoomManagement.findByPk(id);

  if (!room) {
    throw new Error('Room not found');
  }

  await room.destroy();

  return true;
};

export default {
  createRoom,
  getRooms,
  getRoomById,
  updateRoom,
  deleteRoom,
};