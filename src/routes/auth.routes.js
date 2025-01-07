import express from "express";
import {
  changePassword,
  resetPassword,
  forgotPassword,
  logout,
  login,
  signup,
  editProfile,
  getProfile,
} from "../controllers/auth.controllers.js";
import upload from "../middleware/multer.profile.js";
import { verifyToken } from "../middleware/verifyToken.js";

const router = express.Router();

router.post("/signup", upload.single("profilePicture"), signup);
router.post("/login", login);
router.post("/logout", logout);

router.post("/forgot-password", forgotPassword);
router.post("/reset-password/:token", resetPassword);
router.post("/change-password", verifyToken, changePassword);

router.post(
  "/edit-profile",
  verifyToken,
  upload.single("profilePicture"),
  editProfile
);

router.get("/profile", verifyToken, getProfile);

export default router;
