import { Router } from "express";
import {
  createUser,
  deleteUser,
  editUser,
  getUsers,
  resendOTP,
  resetPassword,
  verifyOTP,
  verifyResetPassword,
} from "../controllers/users.controller.js";
import { loginMiddleware } from "../middlewares/authMiddleware.js";

const router = Router();

router.post("/new", createUser);
router.delete("/:id", loginMiddleware, deleteUser);
router.put("/:id", loginMiddleware, editUser);
router.get("/", loginMiddleware, getUsers);
router.post("/verify-otp", verifyOTP);
router.post("/resend-otp", resendOTP);
router.post("/forgot-password", resetPassword);
router.post("/verify-reset-password", verifyResetPassword);

export default router;
