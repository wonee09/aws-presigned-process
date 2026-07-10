"use client";
import { useState } from "react";
import { useLogin } from "@/hooks/queries/useAuth";
import { useRouter } from "next/navigation";
import { useAuth } from "@/contexts/AuthContext";

export default function LoginPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const { mutate: login, isPending } = useLogin();
  const { isLoggedIn } = useAuth();
  const router = useRouter();

  if (isLoggedIn) {
    router.replace("/products");
    return null;
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    login({ email, password }, { onSuccess: () => router.push("/products") });
  };

  return (
    <main>
      <h1>로그인</h1>
      <form onSubmit={handleSubmit}>
        <input
          type="email"
          placeholder="이메일"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
        />
        <input
          type="password"
          placeholder="비밀번호"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          required
        />
        <button type="submit" disabled={isPending}>
          {isPending ? "로그인 중..." : "로그인"}
        </button>
      </form>
      <a href="/signup">회원가입</a>
    </main>
  );
}
