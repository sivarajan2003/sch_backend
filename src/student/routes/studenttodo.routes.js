//studenttodo.routes.js
import express from "express";
import controller from "../controller/studenttodo.controller.js";

const router = express.Router();

router.get(
  "/student/:studentId",
  controller.getByStudent
);

export default router;