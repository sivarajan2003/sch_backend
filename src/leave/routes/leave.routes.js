//leave.routes.js
import express from "express";
import controller from "../controller/leave.controller.js";

const router = express.Router();

router.post("/", controller.createLeave);

router.get("/", controller.getLeaves);

router.put("/:id", controller.updateLeave);

router.delete("/:id", controller.deleteLeave);

export default router;