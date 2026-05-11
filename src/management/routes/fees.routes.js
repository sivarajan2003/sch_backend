import express from 'express';
import controller from '../controller/fees.controller.js';

const router = express.Router();

router.post("/", controller.createFees);

router.get("/", controller.getFees);

router.put("/:id", controller.updateFees);

router.delete("/:id", controller.deleteFees);

export default router;