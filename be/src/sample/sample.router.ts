// 참고용 샘플 라우터 — 이 패턴을 따라 라우터를 작성하세요.
import { Router } from "express";
import { getSamples, getSampleById } from "./sample.controller";

const router = Router();

router.get("/", getSamples);
router.get("/:id", getSampleById);

export default router;
