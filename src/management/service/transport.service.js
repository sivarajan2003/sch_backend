import Transport from "../models/transport.model.js";

const create = async (data) => {
  const count = await Transport.count();

  return await Transport.create({
    transport_id: `TR${String(count + 1).padStart(3, "0")}`,
    route: data.route,
    status: data.status,
    date: data.date,
  });
};

const getAll = async () => {
  return await Transport.findAll();
};

const update = async (id, data) => {
  return await Transport.update(data, {
    where: { id },
  });
};

const remove = async (id) => {
  return await Transport.destroy({
    where: { id },
  });
};

export default {
  create,
  getAll,
  update,
  remove,
};