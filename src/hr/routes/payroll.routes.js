//payroll.routes.js
import express from "express";
import controller from "../controller/payroll.controller.js";

const router = express.Router();

router.post("/", controller.createPayroll);
router.get("/", controller.getPayroll);
router.patch("/:id/pay", controller.markPaid);
router.delete("/:id", controller.deletePayroll);

export default router;