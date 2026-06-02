//noticeboard.routes.js
import express from "express";
import controller from "../controller/noticeboard.controller.js";

const router = express.Router();

router.post(
  "/noticeboard",
  controller.createNotice
);

router.get(
  "/noticeboard",
  controller.getNotices
);

router.delete(
  "/noticeboard/:id",
  controller.deleteNotice
);

export default router;