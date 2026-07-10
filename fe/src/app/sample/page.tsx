"use client";

import { useProducts, useProduct, useCreateProduct } from "@/hooks/queries/useProduct";
import { useAuth } from "@/contexts/AuthContext";

export default function SamplePage() {
  const {
    data: products,
    isLoading: isProductsLoading,
    isError: isProductsError,
  } = useProducts({ category: "스낵" });

  const {
    data: product,
    isLoading: isProductLoading,
  } = useProduct(1);

  const { mutate: createProduct, isPending: isCreating } = useCreateProduct();

  const { user, isLoggedIn, logout } = useAuth();

  if (isProductsLoading || isProductLoading) return <p>로딩 중...</p>;
  if (isProductsError) return <p>에러 발생</p>;

  const handleCreate = () => {
    createProduct({
      name: "새 상품",
      price: 1000,
      category: "스낵",
      s3Key: "uploads/sample.jpg",
    });
  };

  return (
    <main>
      <h1>샘플 페이지</h1>

      {isLoggedIn ? (
        <div>
          <p>안녕하세요, {user?.name}님</p>
          <button onClick={logout}>로그아웃</button>
        </div>
      ) : (
        <a href="/login">로그인</a>
      )}

      <ul>
        {products?.data.map((p) => (
          <li key={p.id}>
            {p.name} - {p.price}원
          </li>
        ))}
      </ul>

      {product && <p>선택된 상품: {product.name}</p>}

      <button onClick={handleCreate} disabled={isCreating}>
        {isCreating ? "등록 중..." : "상품 등록"}
      </button>
    </main>
  );
}
