import express from "express";
import authRouter from "./auth.routes.js";
import productRouter from "./product.routes.js";

const router = express.Router();

router.use("/auth", authRouter);
router.use("/products", productRouter);

export default router;
