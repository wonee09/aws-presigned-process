"use client";
import { use } from "react";
import { useProduct, useDeleteProduct } from "@/hooks/queries/useProduct";
import { useRouter } from "next/navigation";
import { useAuth } from "@/contexts/AuthContext";

export default function ProductDetailPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = use(params);
  const { data: product, isLoading, isError } = useProduct(Number(id));
  const { mutate: deleteProduct } = useDeleteProduct();
  const { user } = useAuth();
  const router = useRouter();

  if (isLoading) return <p>로딩 중...</p>;
  if (isError || !product) return <p>상품을 찾을 수 없습니다.</p>;

  const isOwner = user?.id === product.userId;

  const handleDelete = () => {
    if (!confirm("삭제하시겠습니까?")) return;
    deleteProduct(product.id, {
      onSuccess: () => router.push("/products"),
    });
  };

  return (
    <main>
      <h1>{product.name}</h1>
      <p>가격: {product.price.toLocaleString()}원</p>
      <p>카테고리: {product.category}</p>
      {product.link && <a href={product.link}>구매 링크</a>}
      {product.viewUrl && (
        // eslint-disable-next-line @next/next/no-img-element
        <img src={product.viewUrl} alt={product.name} style={{ width: 300 }} />
      )}
      {isOwner && (
        <div>
          <button onClick={() => router.push(`/products/${id}/edit`)}>수정</button>
          <button onClick={handleDelete}>삭제</button>
        </div>
      )}
    </main>
  );
}
