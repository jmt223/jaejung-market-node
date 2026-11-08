import Head from "next/head";
import Link from "next/link";
import { useRouter } from "next/router";
import ErrorPage from "@/components/ErrorPage";
import ProductForm from "@/components/ProductForm";
import { apiPost } from "@/lib/api";
import { imageUrl } from "@/lib/format";
import { useAdmin, useAdminSubmit } from "@/lib/hooks";
import { Product } from "@/lib/types";

// 상품 수정
export default function AdminProductEdit() {
  const router = useRouter();
  const { id } = router.query;
  const { error, run } = useAdminSubmit();
  const { data: post, error: loadError } = useAdmin<Product>(router.isReady ? `/api/admin/products/${id}` : null);

  // 폼 제출하면 실행됨
  const onSubmit = (form: FormData) => {
    void run(async () => {
      await apiPost(`/api/admin/products/${id}/edit`, form);
      await router.push("/admin/products");
    });
  };

  // 없는 상품이면 공통 에러페이지
  if (loadError && loadError.status === 404) {
    return <ErrorPage />;
  }

  return (
    <>
      <Head>
        <title>상품 수정 - 재중마켓</title>
      </Head>
      <div className="admin-container">
        <h1>상품 수정</h1>
        {error && <p style={{ color: "red" }}>{error}</p>}
        {post && (
          <>
            {post.fileName && (
              <>
                <p>현재 이미지:</p>
                <div className="product-image-preview">
                  <img src={imageUrl(post.fileName)} alt={post.title} />
                </div>
              </>
            )}
            <ProductForm key={post.id} product={post} submitLabel="수정" imageLabel="이미지 변경" onSubmit={onSubmit} />
          </>
        )}
        <Link href="/admin/products" className="btn">
          상품 관리로 돌아가기
        </Link>
      </div>
    </>
  );
}
