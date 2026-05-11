import Sports from "../models/sports.model.js";

const create = (data) => {
  return Sports.create(data);
};

const getAll = () => {
  return Sports.find();
};

const update = (id, data) => {
  return Sports.findByIdAndUpdate(
    id,
    data,
    { new: true }
  );
};

const remove = (id) => {
  return Sports.findByIdAndDelete(id);
};

export default {
  create,
  getAll,
  update,
  remove,
};