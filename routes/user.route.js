import express from "express";

import {
  updateMe,
  deleteMe,
  uploadUserPhoto,
  resizeUserPhoto,
} from "../controllers/user.controller.js";
import { protect } from "../middlewares/protect.js";

const router = express.Router();

router.use(protect);
router.patch("/updateMe", uploadUserPhoto, resizeUserPhoto, updateMe);
router.delete("/deleteMe", deleteMe);

export default router;
