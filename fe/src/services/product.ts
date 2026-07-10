import api from "./api";
import {
  Product,
  CreateProductRequest,
  GetProductsParams,
  ProductListResponse,
} from "@/types/product";

export const getProducts = async (
  params?: GetProductsParams
): Promise<ProductListResponse> => {
  const res = await api.get<ProductListResponse>("/products", { params });
  return res.data;
};

export const getProduct = async (id: number): Promise<Product> => {
  const res = await api.get<Product>(`/products/${id}`);
  return res.data;
};

export const createProduct = async (
  data: CreateProductRequest
): Promise<Product> => {
  const res = await api.post<Product>("/products", data);
  return res.data;
};

export const updateProduct = async (
  id: number,
  data: Partial<CreateProductRequest>
): Promise<Product> => {
  const res = await api.patch<Product>(`/products/${id}`, data);
  return res.data;
};

export const deleteProduct = async (id: number): Promise<void> => {
  await api.delete(`/products/${id}`);
};

export const getPresignedUploadUrl = async (
  filename: string,
  contentType: string
): Promise<{ uploadUrl: string; s3Key: string }> => {
  const res = await api.get<{ uploadUrl: string; s3Key: string }>(
    "/products/presigned-upload-url",
    { params: { filename, contentType } }
  );
  return res.data;
};
