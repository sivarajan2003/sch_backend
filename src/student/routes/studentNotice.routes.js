//studentNotice.routes.js
import express from "express";
import controller from "../controller/studentNotice.controller.js";
import { verifyToken } from "../../middleware/auth.js";
import { validate } from "../../middleware/validate.js";
import dto from "../dto/studentNotice.dto.js";

const router = express.Router();

router.post(
  "/",
  verifyToken([
    "Admin",
    "Class Teacher",
    "Subject Teacher",
  ]),
  validate(dto.createNoticeSchema),
  controller.createNotice
);

router.get(
  "/student/:studentId",
  verifyToken([
    "Admin",
    "Student",
    "Class Teacher",
    "Subject Teacher",
  ]),
  controller.getStudentNotices
);
export default router;