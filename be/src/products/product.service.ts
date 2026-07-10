import { PutObjectCommand, GetObjectCommand } from "@aws-sdk/client-s3";
import { getSignedUrl } from "@aws-sdk/s3-request-presigner";
import { prisma } from "../lib/prisma";
import { s3 } from "../lib/s3";

export const getPresignedUploadUrl = async (
  filename: string,
  contentType: string
) => {
  const s3Key = `uploads/${Date.now()}_${filename}`;
  const command = new PutObjectCommand({
    Bucket: process.env.AWS_BUCKET_NAME,
    Key: s3Key,
    ContentType: contentType,
  });
  const uploadUrl = await getSignedUrl(s3, command, { expiresIn: 60 * 5 });
  return { uploadUrl, s3Key };
};

export const createProduct = async (
  userId: number,
  data: {
    name: string;
    price: number;
    category: string;
    s3Key: string;
    link?: string;
  }
) => {
  return prisma.product.create({
    data: { ...data, userId },
  });
};

export const getProducts = async (params: {
  cursor?: number;
  category?: string;
  limit?: number;
}) => {
  const { cursor, category, limit = 10 } = params;

  const products = await prisma.product.findMany({
    take: limit + 1,
    ...(cursor && { cursor: { id: cursor }, skip: 1 }),
    where: category ? { category } : undefined,
    orderBy: { createdAt: "desc" },
  });

  const hasNext = products.length > limit;
  const data = hasNext ? products.slice(0, -1) : products;
  const nextCursor = hasNext ? data[data.length - 1].id : null;

  return { data, nextCursor };
};

export const getProductById = async (id: number) => {
  return prisma.product.findUnique({ where: { id } });
};

export const updateProduct = async (
  id: number,
  userId: number,
  data: Partial<{
    name: string;
    price: number;
    category: string;
    s3Key: string;
    link: string;
  }>
) => {
  const product = await prisma.product.findUnique({ where: { id } });
  if (!product) throw new Error("상품을 찾을 수 없습니다.");
  if (product.userId !== userId) throw new Error("권한이 없습니다.");
  return prisma.product.update({ where: { id }, data });
};

export const deleteProduct = async (id: number, userId: number) => {
  const product = await prisma.product.findUnique({ where: { id } });
  if (!product) throw new Error("상품을 찾을 수 없습니다.");
  if (product.userId !== userId) throw new Error("권한이 없습니다.");
  return prisma.product.delete({ where: { id } });
};

export const getViewUrl = async (s3Key: string) => {
  const command = new GetObjectCommand({
    Bucket: process.env.AWS_BUCKET_NAME,
    Key: s3Key,
  });
  return getSignedUrl(s3, command, { expiresIn: 60 * 60 });
};
