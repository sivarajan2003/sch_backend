//transport.routes.js
import express from "express";
import controller from "../controller/transport.controller.js";
const router = express.Router();

// === BUS ENDPOINTS ===
router.get("/buses", controller.getBuses);
router.post("/buses", controller.createBus);
router.put("/buses/:id", controller.updateBus);
router.delete("/buses/:id", controller.deleteBus);

// === ROUTE ENDPOINTS ===
router.get("/routes", controller.getRoutes);
router.post("/routes", controller.createRoute);
router.put("/routes/:id", controller.updateRoute);
router.delete("/routes/:id", controller.deleteRoute);

// === STUDENT ASSIGNMENT ENDPOINTS ===
router.get("/students", controller.getStudents);
router.post("/students", controller.createStudent);
router.delete("/students/:id", controller.deleteStudent);

// === PICKUP EVENT ENDPOINTS ===
router.post("/routes/:routeId/pickup", controller.createPickupEvent);
router.get("/routes/:routeId/pickups", controller.getPickupEvents);

export default router;