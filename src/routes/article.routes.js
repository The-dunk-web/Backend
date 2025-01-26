import express from "express";
import upload from "../middleware/multer.profile.js";
import {
  createArticle,
  getAllArticles,
  getArticleById,
  updateArticle,
  deleteArticle,
  likeOrUnlikeArticle,
  getLikedArticles,
} from "../controllers/article.controllers.js";
import { verifyToken } from "../middleware/verifyToken.js";

const router = express.Router();

router.post("/create", verifyToken, upload.single("image"), createArticle);
router.get("/", getAllArticles);
router.get("/:id", getArticleById);
router.put("/:id", verifyToken, upload.single("image"), updateArticle);
router.delete("/:id", verifyToken, deleteArticle);
router.post("/:id/like", verifyToken, likeOrUnlikeArticle);
router.get("/liked", verifyToken, getLikedArticles);

export default router;
