import express from "express";

import controller from "../controller/transport.controller.js";

const router = express.Router();

router.post(
  "/",
  controller.createTransport
);

router.get(
  "/",
  controller.getTransport
);

router.put(
  "/:id",
  controller.updateTransport
);

router.delete(
  "/:id",
  controller.deleteTransport
);

export default router;