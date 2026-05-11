import express from "express";
import controller from "../controller/sports.controller.js";

const router = express.Router();

router.post(
  "/",
  controller.createSports
);

router.get(
  "/",
  controller.getSports
);

router.put(
  "/:id",
  controller.updateSports
);

router.delete(
  "/:id",
  controller.deleteSports
);

export default router;