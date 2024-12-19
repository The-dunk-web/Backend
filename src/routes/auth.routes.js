import express from "express";
import { signup } from "../controllers/auth.controllers.js";
import upload from "../middleware/multer.profile.js";

const router = express.Router();

router.post("/signup", upload.single("profilePicture"), signup);

export default router;
