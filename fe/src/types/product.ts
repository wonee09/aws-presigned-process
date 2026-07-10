export interface Product {
  id: number;
  name: string;
  price: number;
  category: string;
  s3Key: string;
  link: string | null;
  createdAt: string;
  updatedAt: string;
  userId: number;
  viewUrl?: string;
}

export interface CreateProductRequest {
  name: string;
  price: number;
  category: string;
  s3Key: string;
  link?: string;
}

export interface GetProductsParams {
  cursor?: number;
  category?: string;
  limit?: number;
}

export interface ProductListResponse {
  data: Product[];
  nextCursor: number | null;
}
