//routes/index.js
import express from "express";

import feesRoute from "./fees.routes.js";
import libraryMemberRoute from "./libraryMember.routes.js";
import sportsRoute from "./sports.routes.js";
import transportRoute from "./transport.routes.js";
const router = express.Router();

router.use("/fees", feesRoute);

router.use(
  "/library-member",
  libraryMemberRoute
);

router.use(
  "/sports",
  sportsRoute
);
router.use(
  "/transport",
  transportRoute
);

export default router;