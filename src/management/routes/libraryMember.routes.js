import express from "express";

import controller from "../controller/libraryMember.controller.js";

const router = express.Router();

router.post("/", controller.createMember);

router.get("/", controller.getMembers);

router.put("/:id", controller.updateMember);

router.delete("/:id", controller.deleteMember);

export default router;