"use client";
import { useProducts } from "@/hooks/queries/useProduct";
import Link from "next/link";
import { useAuth } from "@/contexts/AuthContext";

export default function ProductsPage() {
  const { data, isLoading, isError } = useProducts();
  const { isLoggedIn, user, logout } = useAuth();

  if (isLoading) return <p>로딩 중...</p>;
  if (isError) return <p>에러가 발생했습니다.</p>;

  return (
    <main>
      <header>
        <h1>상품 목록</h1>
        {isLoggedIn ? (
          <div>
            <span>{user?.name}님</span>
            <button onClick={logout}>로그아웃</button>
            <Link href="/products/new">상품 등록</Link>
          </div>
        ) : (
          <Link href="/login">로그인</Link>
        )}
      </header>

      <ul>
        {data?.data.map((product) => (
          <li key={product.id}>
            <Link href={`/products/${product.id}`}>
              <span>{product.name}</span>
              <span>{product.price.toLocaleString()}원</span>
              <span>{product.category}</span>
            </Link>
          </li>
        ))}
      </ul>
    </main>
  );
}
