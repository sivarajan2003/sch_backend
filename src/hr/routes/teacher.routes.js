import express from "express";
import controller from "../controller/teacher.controller.js";

const router = express.Router();

router.get("/teacher", controller.getTeachers);

export default router;