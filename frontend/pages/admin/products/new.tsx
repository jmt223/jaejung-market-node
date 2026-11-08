import Head from "next/head";
import Link from "next/link";
import { useRouter } from "next/router";
import ProductForm from "@/components/ProductForm";
import { apiPost } from "@/lib/api";
import { useAdmin, useAdminSubmit } from "@/lib/hooks";
import { Product } from "@/lib/types";

// 새 상품 등록
export default function AdminProductNew() {
  const router = useRouter();
  const { error, run } = useAdminSubmit();
  // 권한 없는 관리자가 URL로 들어오면 대시보드로 돌려보내기 위한 조회
  const { data } = useAdmin<Product[]>("/api/admin/products");

  // 폼 제출하면 실행됨
  const onSubmit = (form: FormData) => {
    void run(async () => {
      await apiPost("/api/admin/products", form);
      await router.push("/admin/products");
    });
  };

  if (!data) {
    return null;
  }

  return (
    <>
      <Head>
        <title>새 상품 등록 - 재중마켓</title>
      </Head>
      <div className="admin-container">
        <h1>새 상품 등록</h1>
        {error && <p style={{ color: "red" }}>{error}</p>}
        <ProductForm submitLabel="등록" imageLabel="이미지" onSubmit={onSubmit} />
        <Link href="/admin/products" className="btn">
          상품 관리로 돌아가기
        </Link>
      </div>
    </>
  );
}
