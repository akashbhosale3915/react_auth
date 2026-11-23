import { Router } from "express";
import { getMe, login, logout } from "../controllers/auth.controller.js";
import { loginMiddleware } from "../middlewares/authMiddleware.js";

const router = Router();

router.post("/login", login);
router.get("/logout", logout);
router.get("/me", loginMiddleware, getMe);

export default router;
