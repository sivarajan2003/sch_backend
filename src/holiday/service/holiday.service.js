import Holiday from "../models/holiday.model.js";

const createHoliday = async (data) => {
  return await Holiday.create(data);
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