import express from "express";
import { login, logout, signup } from "../controllers/auth.controllers.js";
import upload from "../middleware/multer.profile.js";

const router = express.Router();

router.post("/signup", upload.single("profilePicture"), signup);
router.post("/login", login);
router.post("/logout", logout);

export default router;
