"use client";
import { useState } from "react";
import { useSignup } from "@/hooks/queries/useAuth";
import { useRouter } from "next/navigation";

export default function SignupPage() {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const { mutate: signup, isPending } = useSignup();
  const router = useRouter();

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    signup({ name, email, password }, { onSuccess: () => router.push("/login") });
  };

  return (
    <main>
      <h1>회원가입</h1>
      <form onSubmit={handleSubmit}>
        <input
          type="text"
          placeholder="이름"
          value={name}
          onChange={(e) => setName(e.target.value)}
          required
        />
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
          {isPending ? "가입 중..." : "회원가입"}
        </button>
      </form>
    </main>
  );
}
