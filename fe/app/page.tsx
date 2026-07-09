"use client";

import { useState, useEffect } from "react";
interface Photo {
  id: number;
  s3Key: string;
  filename: string;
  createdAt: string;
  viewUrl: string;
}

export default function Home() {
  const [file, setFile] = useState<File | null>(null);
  const [status, setStatus] = useState<string>("");
  const [photos, setPhotos] = useState<Photo[]>([]);

  async function uploadFlow() {
    if (!file) return alert("파일을 선택하세요");

    // Step 1: 백엔드에서 Presigned Upload URL 발급
    setStatus("Step 1: Presigned Upload URL 발급 중...");

    // encodeURIComponent란? url에 한글이나 공백이 포함될 경우를 대비해 인코딩한다(전송을 위한 처리)
    // fetch는 한글과 공백을 지원하지 않기 때문에 인코딩한다
    const response = await fetch(
      `http://localhost:8080/presigned-upload-url?filename=${encodeURIComponent(
        file.name,
      )}&contentType=${encodeURIComponent(file.type)}`,
    );
    // s3Key : 클라이언트가 S3에 직접 업로드한 후 백엔드 DB에 저장할 때 필요.
    // uploadUrl : 클라이언트가 S3에 직접 업로드할 때 필요
    const { uploadUrl, s3Key } = await response.json();

    // Step 2: S3에 직접 PUT 업로드 (백엔드를 거치지 않음)
    setStatus("Step 2: S3에 직접 업로드 중...");
    const s3Res = await fetch(uploadUrl, {
      method: "PUT",
      headers: { "Content-Type": file.type },
      body: file,
    });
    if (!s3Res.ok) return setStatus("S3 업로드 실패: " + s3Res.status);

    // Step 3: 백엔드 DB에 저장
    setStatus("Step 3: DB에 저장 중...");
    await fetch(`http://localhost:8080/photos`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ s3Key, filename: file.name }),
    });

    setStatus("완료!");
    loadPhotos();
  }

  async function loadPhotos() {
    const response = await fetch(`http://localhost:8080/photos`);
    const photosData = await response.json();
    setPhotos(photosData);
  }

  useEffect(() => {
    loadPhotos();
  }, []);

  return (
    <main
      style={{
        maxWidth: 600,
        margin: "40px auto",
        padding: "0 20px",
        fontFamily: "sans-serif",
      }}
    >
      <h2>S3 Presigned URL - 이미지 업로드</h2>

      <input
        type="file"
        accept="image/*"
        onChange={(e) => setFile(e.target.files?.[0] ?? null)}
      />
      <button onClick={uploadFlow} style={{ marginLeft: 8 }}>
        업로드
      </button>
      <p style={{ color: "gray", fontSize: "0.9em" }}>{status}</p>

      <hr />
      <h3>업로드된 사진 목록</h3>
      {photos.map((p) => (
        <div key={p.id} style={{ marginBottom: 16 }}>
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src={p.viewUrl}
            alt={p.filename}
            style={{ width: 200, border: "1px solid #ccc" }}
          />
          <small style={{ display: "block", color: "#555" }}>
            {p.filename} ({new Date(p.createdAt).toLocaleString()})
          </small>
          <small
            style={{
              display: "block",
              color: "#aaa",
              wordBreak: "break-all",
              fontSize: "0.75em",
            }}
          >
            s3Key: {p.s3Key}
          </small>
        </div>
      ))}
    </main>
  );
}
