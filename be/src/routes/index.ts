import { Router } from "express";
import authRouter from "../auth/auth.router";
import productRouter from "../products/product.router";
import sampleRouter from "../sample/sample.router";

const router = Router();

router.use("/auth", authRouter);
router.use("/products", productRouter);
router.use("/samples", sampleRouter);

export default router;
