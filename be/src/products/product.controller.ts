import { Response } from "express";
import { AuthRequest } from "../middlewares/auth";
import * as productService from "./product.service";

export const getPresignedUrl = async (req: AuthRequest, res: Response) => {
  const { filename, contentType } = req.query as {
    filename: string;
    contentType: string;
  };
  const result = await productService.getPresignedUploadUrl(filename, contentType);
  res.json(result);
};

export const getProducts = async (req: AuthRequest, res: Response) => {
  const { cursor, category, limit } = req.query;
  const result = await productService.getProducts({
    cursor: cursor ? Number(cursor) : undefined,
    category: category as string | undefined,
    limit: limit ? Number(limit) : undefined,
  });
  res.json(result);
};

export const getProduct = async (req: AuthRequest, res: Response) => {
  const product = await productService.getProductById(Number(req.params.id));
  if (!product) {
    res.status(404).json({ message: "상품을 찾을 수 없습니다." });
    return;
  }
  const viewUrl = await productService.getViewUrl(product.s3Key);
  res.json({ ...product, viewUrl });
};

export const createProduct = async (req: AuthRequest, res: Response) => {
  const product = await productService.createProduct(req.userId!, req.body);
  res.status(201).json(product);
};

export const updateProduct = async (req: AuthRequest, res: Response) => {
  try {
    const product = await productService.updateProduct(
      Number(req.params.id),
      req.userId!,
      req.body
    );
    res.json(product);
  } catch (error) {
    res.status(403).json({ message: (error as Error).message });
  }
};

export const deleteProduct = async (req: AuthRequest, res: Response) => {
  try {
    await productService.deleteProduct(Number(req.params.id), req.userId!);
    res.status(204).send();
  } catch (error) {
    res.status(403).json({ message: (error as Error).message });
  }
};
