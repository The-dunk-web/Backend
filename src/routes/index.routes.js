import express from "express";
import authRouter from "./auth.routes.js";
import productRouter from "./product.routes.js";
import orderRouter from "./order.routes.js";
import articleRouter from "./article.routes.js";
import serviceRouter from "./service.routes.js";
import reviewRouter from "./review.routes.js";
import redRoomRouter from "./redRoom.routes.js";

const router = express.Router();

router.use("/auth", authRouter);
router.use("/products", productRouter);
router.use("/orders", orderRouter);
router.use("/articles", articleRouter);
router.use("/services", serviceRouter);
router.use("/reviews", reviewRouter);
router.use("/red-room", redRoomRouter);

export default router;
