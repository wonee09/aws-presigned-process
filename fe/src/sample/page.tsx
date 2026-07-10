// 이 파일은 참고용 샘플입니다. 실제 구현 시 이 패턴을 따라 작성하세요.
"use client";

import { useProducts, useProduct, useCreateProduct } from "@/hooks/queries/useProduct";
import { useAuth } from "@/contexts/AuthContext";

export default function SamplePage() {
  // ✅ 목록 조회
  const {
    data: products,
    isLoading: isProductsLoading,
    isError: isProductsError,
  } = useProducts({ category: "스낵" });

  // ✅ 단건 조회
  const { data: product, isLoading: isProductLoading } = useProduct(1);

  // ✅ 생성 (mutation)
  const { mutate: createProduct, isPending: isCreating } = useCreateProduct();

  // ✅ AuthContext 사용
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

      {/* 로그인 정보 */}
      {isLoggedIn ? (
        <div>
          <p>안녕하세요, {user?.name}님</p>
          <button onClick={logout}>로그아웃</button>
        </div>
      ) : (
        <a href="/login">로그인</a>
      )}

      {/* 목록 */}
      <ul>
        {products?.data.map((p) => (
          <li key={p.id}>
            {p.name} - {p.price}원
          </li>
        ))}
      </ul>

      {/* 단건 */}
      {product && <p>선택된 상품: {product.name}</p>}

      {/* 생성 */}
      <button onClick={handleCreate} disabled={isCreating}>
        {isCreating ? "등록 중..." : "상품 등록"}
      </button>
    </main>
  );
}
