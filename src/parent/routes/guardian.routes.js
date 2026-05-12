import express from "express";

import controller from "../controller/guardian.controller.js";
import dto from "../dto/guardian.dto.js";

import { validate } from "../../middleware/validate.js";
import { verifyToken } from "../../middleware/auth.js";

const router = express.Router();

router.post(
  "/",
  verifyToken(["Admin","Super Admin"]),
  validate(dto.createGuardianSchema),
  controller.createGuardian
);

router.get(
  "/",
  verifyToken(["Admin","Super Admin"]),
  controller.getGuardians
);

router.put(
  "/:id",
  verifyToken(["Admin","Super Admin"]),
  validate(dto.updateGuardianSchema),
  controller.updateGuardian
);

router.delete(
  "/:id",
  verifyToken(["Super Admin"]),
  controller.deleteGuardian
);

export default router;