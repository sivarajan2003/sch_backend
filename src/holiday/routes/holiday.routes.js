//holiday.routes.js
import express from "express";
import controller from "../controller/holiday.controller.js";

const router = express.Router();

router.post("/", controller.createHoliday);

router.get("/", controller.getHoliday);

router.put("/:id", controller.updateHoliday);

router.delete("/:id", controller.deleteHoliday);

export default router;