import TransportRoute from "../models/transport.model.js";
import Bus from "../models/bus.model.js";
import TransportStudent from "../models/transportStudent.model.js";
import PickupEvent from "../models/pickupEvent.model.js";

// === BUS SERVICES ===
const getBuses = () => {
  return Bus.findAll({ order: [['createdAt', 'DESC']] });
};

const createBus = (data) => {
  return Bus.create(data);
};

const updateBus = async (id, data) => {
  await Bus.update(data, { where: { id } });
  return Bus.findByPk(id);
};

const deleteBus = (id) => {
  return Bus.destroy({ where: { id } });
};

// === ROUTES SERVICES ===
const getRoutes = async () => {
  const list = await TransportRoute.findAll({ order: [['createdAt', 'DESC']] });
    return list.map(item => {
      const raw = item.get({ plain: true });
      try {
        raw.stops = typeof raw.stops === 'string' ? JSON.parse(raw.stops) : raw.stops;
      } catch (e) {
        raw.stops = [];
      }
      // Preserve currentStopIndex for live tracking
      raw.currentStopIndex = raw.currentStopIndex !== undefined ? raw.currentStopIndex : -1;
      return raw;
    });
};

const createRoute = async (data) => {
  // Prepare payload for the primary (Morning) route
  const payload = {
    ...data,
    stops: Array.isArray(data.stops) ? JSON.stringify(data.stops) : "[]",
    shift: data.shift || 'Morning',
  };

  // Create the primary route
  const created = await TransportRoute.create(payload);

  // Parse stops for further processing
  let stopsArray = [];
  try {
    stopsArray = JSON.parse(payload.stops);
  } catch (e) {
    stopsArray = [];
  }

  // If this is a Morning route, automatically create the reverse Evening route
  if ((payload.shift || 'Morning') === 'Morning') {
    const reversedStops = [...stopsArray].reverse();
    const reversePayload = {
      ...payload,
      id: `${payload.id}_E`, // ensure a unique id for the reverse route
      stops: JSON.stringify(reversedStops),
      shift: 'Evening',
    };
    // Insert reverse route (ignore if id already exists)
    try {
      await TransportRoute.create(reversePayload);
    } catch (e) {
      // Log but do not fail the primary creation
      console.error('Failed to create reverse Evening route:', e);
    }
  }

  // Return the original route in a parsed format
  const raw = created.get({ plain: true });
  try {
    raw.stops = JSON.parse(raw.stops);
  } catch (e) {
    raw.stops = [];
  }
  return raw;
};

const updateRoute = async (id, data) => {
  const payload = { ...data };
  if (data.stops) {
    payload.stops = Array.isArray(data.stops) ? JSON.stringify(data.stops) : "[]";
  }
  await TransportRoute.update(payload, { where: { id } });
  const updated = await TransportRoute.findByPk(id);
  if (!updated) return null;
  
  const raw = updated.get({ plain: true });
  try {
    raw.stops = JSON.parse(raw.stops);
  } catch (e) {
    raw.stops = [];
  }
  return raw;
};

const deleteRoute = (id) => {
  return TransportRoute.destroy({ where: { id } });
};

// === STUDENT ASSIGNMENTS SERVICES ===
const getStudents = () => {
  return TransportStudent.findAll({ order: [['createdAt', 'DESC']] });
};

const createStudent = (data) => {
  return TransportStudent.create(data);
};

const deleteStudent = (id) => {
  return TransportStudent.destroy({ where: { id } });
};

// === PICKUP EVENT SERVICES ===
const createPickupEvent = async ({ routeId, stopName, stopIndex, pickedCount }) => {
  const id = `PE_${routeId}_${stopIndex}_${Date.now()}`;
  const event = await PickupEvent.create({
    id,
    routeId,
    stopName,
    stopIndex: stopIndex ?? 0,
    pickupTime: new Date(),
    pickedCount: pickedCount ?? 0
  });
  return event.get({ plain: true });
};

const getPickupEvents = async (routeId) => {
  const { Op } = await import('sequelize');
  const events = await PickupEvent.findAll({
    where: { routeId },
    order: [['pickupTime', 'ASC']]
  });
  return events.map(e => e.get({ plain: true }));
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