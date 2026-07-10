// 참고용 샘플 서비스 — 이 패턴을 따라 서비스를 작성하세요.
import { prisma } from "../lib/prisma";

export const findAllSamples = async () => {
  // prisma를 통해 DB 조회
  return prisma.product.findMany({ take: 5 });
};

export const findSampleById = async (id: number) => {
  return prisma.product.findUnique({ where: { id } });
};
