//todo.routes.js
import express from "express";
import controller
from "../controller/todo.controller.js";

const router = express.Router();

router.get(
  "/dashboard/todos",
  controller.getTodos
);

export default router;