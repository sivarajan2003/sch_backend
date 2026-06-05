//homework.routes.js
import express from "express";
import controller from "../controller/homework.controller.js";

const router = express.Router();

router.post(
  "/",
  controller.createHomework
);

router.get(
  "/student/:studentId",
  controller.getStudentHomework
);

export default router;
