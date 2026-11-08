import Head from "next/head";
import Link from "next/link";
import { useRouter } from "next/router";
import { FormEvent } from "react";
import ErrorPage from "@/components/ErrorPage";
import SiteFooter from "@/components/SiteFooter";
import SiteHeader from "@/components/SiteHeader";
import { useAuth } from "@/context/AuthContext";
import { useCart } from "@/context/CartContext";
import { formatDate, formValues, imageUrl } from "@/lib/format";
import { useProtected, useSubmit } from "@/lib/hooks";
import { Product } from "@/lib/types";

// 상품 상세 페이지
export default function ProductDetail() {
  const router = useRouter();
  const { user } = useAuth();
  const { addToCart } = useCart();
  const { error, run } = useSubmit();
  const { id } = router.query;
  const { data: post, error: loadError } = useProtected<Product>(router.isReady ? `/api/products/${id}` : null);

  if (loadError && loadError.status !== 401) {
    return <ErrorPage />;
  }
  if (!post) {
    return null;
  }

  // 폼 제출하면 실행됨
  const onSubmit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const quantity = Number(formValues(event.currentTarget).quantity);
    void run(async () => {
      await addToCart(post.id, quantity);
      await router.push("/cart");
    });
  };

  return (
    <>
      <Head>
        <title>{`${post.title} - 재중마켓`}</title>
      </Head>

      <SiteHeader />

      <div className="product-list-container">
        <h1>{post.title}</h1>
        <p className="product-price">가격: {post.price}원</p>
        <p>재고: {post.stock}</p>
        <p>카테고리: {post.category}</p>
        <p>게시일: {formatDate(post.createdAt)}</p>
        <p>{post.content}</p>

        {post.fileName && (
          <div className="product-image-preview" style={{ marginBottom: 20 }}>
            <img src={imageUrl(post.fileName)} alt={post.title} style={{ maxWidth: 300, height: "auto" }} />
          </div>
        )}

        {error && <p style={{ color: "red" }}>{error}</p>}

        {user && (
          <form onSubmit={onSubmit} style={{ marginBottom: 20 }}>
            수량:{" "}
            <input
              type="number"
              name="quantity"
              defaultValue={1}
              min={1}
              max={post.stock}
              required
              style={{ width: 60 }}
            />{" "}
            <button type="submit" className="btn">
              장바구니 담기
            </button>
          </form>
        )}

        <Link href="/" className="btn">
          목록으로 돌아가기
        </Link>
      </div>

      <SiteFooter />
    </>
  );
}
