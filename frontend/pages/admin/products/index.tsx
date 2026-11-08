import Head from "next/head";
import Link from "next/link";
import { apiPost } from "@/lib/api";
import { imageUrl } from "@/lib/format";
import { useAdmin, useAdminSubmit } from "@/lib/hooks";
import { Product } from "@/lib/types";

// 상품 관리
export default function AdminProducts() {
  const { data: products, mutate } = useAdmin<Product[]>("/api/admin/products");
  const { error, run } = useAdminSubmit();

  // 삭제 버튼 눌렀을때
  // [보안조치] (1) XSS / CSRF 공격 가능성 : 스프링에서 GET 링크였던거 POST + 토큰으로 바꿈
  const remove = (id: number) => {
    if (confirm("삭제하시겠습니까?")) {
      void run(async () => {
        await apiPost(`/api/admin/products/${id}/delete`);
        await mutate();
      });
    }
  };

  return (
    <>
      <Head>
        <title>상품 관리 - 재중마켓</title>
      </Head>
      <div className="admin-container">
        <h1>상품 관리</h1>
        {error && <p style={{ color: "red" }}>{error}</p>}
        <Link href="/admin/products/new" className="btn">
          새 상품 등록
        </Link>
        <table>
          <thead>
            <tr>
              <th>ID</th>
              <th>상품명</th>
              <th>가격</th>
              <th>재고</th>
              <th>카테고리</th>
              <th>이미지</th>
              <th>관리</th>
            </tr>
          </thead>
          <tbody>
            {products?.map((product) => (
              <tr key={product.id}>
                <td>{product.id}</td>
                <td>{product.title}</td>
                <td>{product.price}</td>
                <td>{product.stock}</td>
                <td>{product.category}</td>
                <td>
                  {product.fileName && (
                    <img src={imageUrl(product.fileName)} alt={product.title} style={{ width: 50, height: "auto" }} />
                  )}
                </td>
                <td>
                  <Link href={`/admin/products/${product.id}/edit`} className="btn">
                    수정
                  </Link>{" "}
                  <button type="button" className="btn" onClick={() => remove(product.id)}>
                    삭제
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
        <br />
        <Link href="/admin/dashboard" className="btn">
          대시보드로 돌아가기
        </Link>
      </div>
    </>
  );
}
