import express from "express";
import holidayRoute from "./holiday.routes.js";

const router = express.Router();

router.use("/holiday", holidayRoute);

export default router;