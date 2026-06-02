//topsubject.routes.js
import express from "express";
import controller from "../controller/topsubject.controller.js";

const router = express.Router();

router.get(
  "/dashboard/top-subjects",
  controller.getTopSubjects
);

export default router;