import express from "express";
import upload from "../middleware/multer.profile.js";
import {
  createProduct,
  updateProduct,
  deleteProduct,
  getProductById,
  getAllProducts,
} from "../controllers/product.controllers.js";
import { verifyToken } from "../middleware/verifyToken.js";

const router = express.Router();

router.post("/create", verifyToken, upload.array("photos", 5), createProduct);

router.put(
  "/update/:id",
  verifyToken,
  upload.array("photos", 5),
  updateProduct
);

router.delete("/:id", verifyToken, deleteProduct);

router.get("/:id", getProductById);

router.get("/", getAllProducts);

export default router;
