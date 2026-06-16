//dashboardCard.routes.js
import express from "express";

import controller
from "../controller/dashboardCard.controller.js";

const router = express.Router();

router.get(
 "/teacher-dashboard/cards/:teacherId",
 controller.getDashboardCards
);

export default router;