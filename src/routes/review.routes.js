import express from "express";
import {
  addReview,
  getReviewsForService,
  updateReview,
  deleteReview,
} from "../controllers/review.controllers.js";
import { verifyToken } from "../middleware/verifyToken.js";

const router = express.Router();

router.post("/:serviceId", verifyToken, addReview);
router.get("/:serviceId", getReviewsForService);
router.put("/update/:id", verifyToken, updateReview);
router.delete("/:id", verifyToken, deleteReview);

export default router;
