import { Router } from "express";
import {
  createUser,
  deleteUser,
  editUser,
  getUsers,
  resendOTP,
  resetPassword,
  uploadImage,
  verifyOTP,
  verifyResetPassword,
} from "../controllers/users.controller.js";
import { loginMiddleware } from "../middlewares/authMiddleware.js";
import multer from "multer";
import path from "path";
import fs from "fs";

const router = Router();

const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    if (!fs.existsSync(path.resolve("server", "uploads"))) {
      fs.mkdirSync(path.resolve("server", "uploads"));
    }

    cb(null, path.resolve("server", "uploads"));
  },
  filename: function (req, file, cb) {
    cb(
      null,
      file.fieldname +
        "-" +
        Date.now() +
        path.extname(file.originalname)
    ); // Define the file name and extension
  },
});
const upload = multer({ storage: storage });

router.post("/new", createUser);
router.delete("/:id", loginMiddleware, deleteUser);
router.put("/:id", loginMiddleware, editUser);
router.post(
  "/:id/upload",
  upload.single("profilePic"),
  uploadImage
);
router.get("/", loginMiddleware, getUsers);
router.post("/verify-otp", verifyOTP);
router.post("/resend-otp", resendOTP);
router.post("/forgot-password", resetPassword);
router.post("/verify-reset-password", verifyResetPassword);

export default router;
