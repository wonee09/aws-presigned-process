// 참고용 샘플 컨트롤러 — 이 패턴을 따라 컨트롤러를 작성하세요.
import { Request, Response } from "express";
import { findAllSamples, findSampleById } from "./sample.service";

export const getSamples = async (req: Request, res: Response) => {
  const samples = await findAllSamples();
  res.json(samples);
};

export const getSampleById = async (req: Request, res: Response) => {
  const { id } = req.params;
  const sample = await findSampleById(Number(id));
  if (!sample) {
    res.status(404).json({ message: "찾을 수 없습니다." });
    return;
  }
  res.json(sample);
};
