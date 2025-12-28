import express from "express";

import {
  signup,
  login,
  verifyAccount,
  forgotPassword,
  resetPassword,
  updatePassword,
  logout,
} from "../controllers/auth.controller.js";
import { protect } from "../middlewares/protect.js";

const router = express.Router();

router.post("/signup", signup);
router.post("/login", login);
router.post("/logout", logout);
router.get("/verify/:token", verifyAccount);
router.post("/forgotPassword", forgotPassword);
router.patch("/resetPassword/:token", resetPassword);

router.use(protect);
router.patch("/updateMyPassword", updatePassword);

router.get("/me", (req, res) => {
  res.status(200).json({ status: "success", data: { user: req.user } });
});

export default router;
