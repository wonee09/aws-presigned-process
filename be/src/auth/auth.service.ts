import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import { prisma } from "../lib/prisma";

export const signupUser = async (
  name: string,
  email: string,
  password: string
) => {
  const existing = await prisma.user.findUnique({ where: { email } });
  if (existing) throw new Error("이미 사용 중인 이메일입니다.");

  const hashedPassword = await bcrypt.hash(password, 10);
  const user = await prisma.user.create({
    data: { name, email, password: hashedPassword },
    select: { id: true, name: true, email: true },
  });

  const token = jwt.sign({ userId: user.id }, process.env.JWT_SECRET as string, {
    expiresIn: "7d",
  });

  return { token, user };
};

export const loginUser = async (email: string, password: string) => {
  const user = await prisma.user.findUnique({ where: { email } });
  if (!user) throw new Error("이메일 또는 비밀번호가 올바르지 않습니다.");

  const isValid = await bcrypt.compare(password, user.password);
  if (!isValid) throw new Error("이메일 또는 비밀번호가 올바르지 않습니다.");

  const token = jwt.sign({ userId: user.id }, process.env.JWT_SECRET as string, {
    expiresIn: "7d",
  });

  const { password: _, ...safeUser } = user;
  return { token, user: safeUser };
};
