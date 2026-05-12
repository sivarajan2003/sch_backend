import express from "express";

import controller from
"../controller/syllabus.controller.js";

const router = express.Router();

router.post(
  "/",
  controller.createSyllabus
);

router.get(
  "/",
  controller.getSyllabus
);

router.delete(
  "/:id",
  controller.deleteSyllabus
);

export default router;