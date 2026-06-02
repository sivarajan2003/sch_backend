//holiday.service.js
import Holiday from "../models/holiday.model.js";

const createHoliday = async (payload) => {
  const count = await Holiday.count();

  return await Holiday.create({
    id: `HL${100 + count + 1}`,
    ...payload,
  });
};

const getHoliday = async () => {
  return await Holiday.findAll({
    order: [["createdAt", "DESC"]]
  });
};

const updateHoliday = async (
  id,
  body
) => {
  await Holiday.update(
    body,
    {
      where: { id }
    }
  );

  return await Holiday.findByPk(id);
};

const deleteHoliday = async (
  id
) => {
  const holiday =
    await Holiday.findByPk(id);

  if (!holiday) {
    return null;
  }

  await holiday.destroy();

  return holiday;
};

export default {
  createHoliday,
  getHoliday,
  updateHoliday,
  deleteHoliday
};