import Transport from "../models/transport.model.js";

const create = (data) => {
  return Transport.create(data);
};

const getAll = () => {
  return Transport.find();
};

const update = (id, data) => {
  return Transport.findByIdAndUpdate(
    id,
    data,
    { new: true }
  );
};

const remove = (id) => {
  return Transport.findByIdAndDelete(id);
};

export default {
  create,
  getAll,
  update,
  remove
};