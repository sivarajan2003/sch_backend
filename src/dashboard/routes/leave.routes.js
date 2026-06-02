//leave.routes.js
import express from "express";
import controller from "../controller/leave.controller.js";

const router = express.Router();

router.post(
  "/leave-requests",
  controller.createLeave
);

router.get(
  "/leave-requests",
  controller.getLeaves
);

router.patch(
  "/leave-requests/:id/approve",
  controller.approveLeave
);

router.patch(
  "/leave-requests/:id/reject",
  controller.rejectLeave
);

export default router;