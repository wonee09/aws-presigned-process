import "dotenv/config";
import express, { Request, Response } from "express";
import cors from "cors";
import { PrismaClient } from "@prisma/client";
import {
  S3Client,
  PutObjectCommand,
  GetObjectCommand,
} from "@aws-sdk/client-s3";
import { getSignedUrl } from "@aws-sdk/s3-request-presigner";

const app = express();
app.use(cors());
app.use(express.json());

const prisma = new PrismaClient();

const s3 = new S3Client({
  region: process.env.AWS_REGION,
  credentials: {
    accessKeyId: process.env.AWS_ACCESS_KEY_ID as string,
    secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY as string,
  },
});

// [Step 1] 클라이언트가 S3에 직접 업로드할 수 있는 Presigned PUT URL 발급
app.get("/presigned-upload-url", async (req: Request, res: Response) => {
  const { filename, contentType } = req.query as {
    filename: string;
    contentType: string;
  };
  const s3Key = `uploads/${Date.now()}_${filename}`;

  const command = new PutObjectCommand({
    Bucket: process.env.AWS_BUCKET_NAME,
    Key: s3Key,
    ContentType: contentType,
  });

  // 5분간 유효한 업로드용 presigned URL 생성
  const uploadUrl = await getSignedUrl(s3, command, { expiresIn: 60 * 5 });

  res.json({ uploadUrl, s3Key });
});

// [Step 2] 클라이언트가 S3 업로드 완료 후 DB에 저장 요청
app.post("/photos", async (req: Request, res: Response) => {
  const { s3Key, filename } = req.body as { s3Key: string; filename: string };

  const photo = await prisma.photo.create({
    data: { s3Key, filename },
  });

  res.status(201).json(photo);
});

// [Step 3] 사진 목록 조회 - 각 사진마다 Presigned GET URL 생성해서 반환
app.get("/photos", async (req: Request, res: Response) => {
  const photos = await prisma.photo.findMany({
    orderBy: { createdAt: "desc" },
  });

  const photosWithUrls = await Promise.all(
    photos.map(async (photo) => {
      const command = new GetObjectCommand({
        Bucket: process.env.AWS_BUCKET_NAME,
        Key: photo.s3Key,
      });
      // 1시간 유효한 조회용 presigned URL 생성
      const viewUrl = await getSignedUrl(s3, command, { expiresIn: 1 * 1 });
      return { ...photo, viewUrl };
    }),
  );

  res.json(photosWithUrls);
});

app.listen(8080, () => {
  console.log("Server running on http://localhost:8080");
});
