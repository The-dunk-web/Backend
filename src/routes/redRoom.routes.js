import express from "express";
import { sendEmails } from "../controllers/redRoom.controllers";

const router = express.Router();

router.get("/sendEmail", sendEmails);

export default router;
