import { Router } from "express";
import { authenticate } from "../middlewares/auth";
import {
  getPresignedUrl,
  getProducts,
  getProduct,
  createProduct,
  updateProduct,
  deleteProduct,
} from "./product.controller";

const router = Router();

router.get("/presigned-upload-url", authenticate, getPresignedUrl);
router.get("/", getProducts);
router.get("/:id", getProduct);
router.post("/", authenticate, createProduct);
router.patch("/:id", authenticate, updateProduct);
router.delete("/:id", authenticate, deleteProduct);

export default router;
