// sports.service.js — Sequelize (was accidentally using Mongoose syntax)
import Sports from "../models/sports.model.js";

const create = (data) => Sports.create(data);

const getAll = () => Sports.findAll({ order: [['createdAt', 'DESC']] });

const update = (id, data) =>
  Sports.update(data, { where: { id } }).then(() => Sports.findByPk(id));

const remove = (id) => Sports.destroy({ where: { id } });

export default { create, getAll, update, remove };
