import express from "express";
import upload from "../middleware/multer.profile.js";
import {
  createService,
  getAllServices,
  getServiceById,
  updateService,
  deleteService,
} from "../controllers/service.controllers.js";
import { verifyToken } from "../middleware/verifyToken.js";

const router = express.Router();

router.post("/create", verifyToken, upload.array("photos", 5), createService);
router.get("/", getAllServices);
router.get("/:id", getServiceById);
router.put(
  "/update/:id",
  verifyToken,
  upload.array("photos", 5),
  updateService
);
router.delete("/:id", verifyToken, deleteService);

export default router;
