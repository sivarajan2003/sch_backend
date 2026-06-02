import transportService from "../service/transport.service.js";

// === BUS CONTROLLERS ===
const getBuses = async (req, res) => {
  try {
    const result = await transportService.getBuses();
    res.json(result);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

const createBus = async (req, res) => {
  try {
    const result = await transportService.createBus(req.body);
    res.status(201).json(result);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

const updateBus = async (req, res) => {
  try {
    const result = await transportService.updateBus(req.params.id, req.body);
    res.json(result);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

const deleteBus = async (req, res) => {
  try {
    await transportService.deleteBus(req.params.id);
    res.json({ message: "Bus deleted successfully" });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// === ROUTE CONTROLLERS ===
const getRoutes = async (req, res) => {
  try {
    const result = await transportService.getRoutes();
    res.json(result);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

const createRoute = async (req, res) => {
  try {
    const result = await transportService.createRoute(req.body);
    res.status(201).json(result);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

const updateRoute = async (req, res) => {
  try {
    const result = await transportService.updateRoute(req.params.id, req.body);
    res.json(result);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

const deleteRoute = async (req, res) => {
  try {
    await transportService.deleteRoute(req.params.id);
    res.json({ message: "Route deleted successfully" });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// === STUDENT ASSIGNMENTS CONTROLLERS ===
const getStudents = async (req, res) => {
  try {
    const result = await transportService.getStudents();
    res.json(result);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

const createStudent = async (req, res) => {
  try {
    const result = await transportService.createStudent(req.body);
    res.status(201).json(result);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

const deleteStudent = async (req, res) => {
  try {
    await transportService.deleteStudent(req.params.id);
    res.json({ message: "Assignment deleted successfully" });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// === PICKUP EVENT CONTROLLERS ===
const createPickupEvent = async (req, res) => {
  try {
    const { routeId } = req.params;
    const { stopName, stopIndex, pickedCount } = req.body;
    const result = await transportService.createPickupEvent({ routeId, stopName, stopIndex, pickedCount });
    res.status(201).json(result);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

const getPickupEvents = async (req, res) => {
  try {
    const { routeId } = req.params;
    const result = await transportService.getPickupEvents(routeId);
    res.json(result);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export default {
  getBuses,
  createBus,
  updateBus,
  deleteBus,
  getRoutes,
  createRoute,
  updateRoute,
  deleteRoute,
  getStudents,
  createStudent,
  deleteStudent,
  createPickupEvent,
  getPickupEvents
};