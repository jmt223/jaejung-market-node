import Head from "next/head";
import Link from "next/link";
import { useRouter } from "next/router";
import { FormEvent, useEffect } from "react";
import SiteFooter from "@/components/SiteFooter";
import SiteHeader from "@/components/SiteHeader";
import { useAuth } from "@/context/AuthContext";
import { useCart } from "@/context/CartContext";
import { formValues } from "@/lib/format";
import { useSubmit } from "@/lib/hooks";

// 장바구니 페이지
export default function Cart() {
  const router = useRouter();
  const { user, isLoading: authLoading } = useAuth();
  const { items, total, updateQuantity, removeItem } = useCart();
  const { error, run } = useSubmit();

  // 로그인 안했으면 로그인 페이지로 보냄
  useEffect(() => {
    if (!authLoading && !user) {
      void router.replace("/login");
    }
  }, [authLoading, user, router]);

  if (!user) {
    return null;
  }

  // 수량 변경
  const onUpdate = (event: FormEvent<HTMLFormElement>, cartId: number) => {
    event.preventDefault();
    const quantity = Number(formValues(event.currentTarget).quantity);
    void run(() => updateQuantity(cartId, quantity));
  };

  // 삭제
  // [보안조치] (1) XSS / CSRF 공격 가능성 : 스프링에서 GET 링크였던거 POST + 토큰으로 바꿈
  const onRemove = (cartId: number) => {
    if (confirm("정말 삭제하시겠습니까?")) {
      void run(() => removeItem(cartId));
    }
  };

  return (
    <>
      <Head>
        <title>장바구니 - 재중마켓</title>
      </Head>

      <SiteHeader />

      <div className="cart-container">
        <h1>장바구니</h1>
        {error && <p style={{ color: "red" }}>{error}</p>}

        {items.length === 0 ? (
          <>
            <p>장바구니에 상품이 없습니다.</p>
            <Link href="/" className="btn">
              메인으로
            </Link>
          </>
        ) : (
          <>
            <table className="table-border">
              <thead>
                <tr>
                  <th>상품명</th>
                  <th>가격</th>
                  <th>수량</th>
                  <th>합계</th>
                  <th>삭제</th>
                </tr>
              </thead>
              <tbody>
                {items.map((item) => (
                  <tr key={item.id}>
                    <td>{item.productTitle}</td>
                    <td>{item.price}원</td>
                    <td>
                      <form onSubmit={(event) => onUpdate(event, item.id)} style={{ display: "inline" }}>
                        <input
                          type="number"
                          name="quantity"
                          defaultValue={item.quantity}
                          key={item.quantity}
                          min={1}
                        />{" "}
                        <button type="submit" className="btn">
                          변경
                        </button>
                      </form>
                    </td>
                    <td>{item.price * item.quantity}원</td>
                    <td>
                      <button type="button" className="btn" onClick={() => onRemove(item.id)}>
                        삭제
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
            <p>총 합계: {total}원</p>
            {/* 결제(주문) 기능은 뺌. 누르면 안내창만 띄움 */}
            <button type="button" className="btn" onClick={() => alert("현재 지원하지 않는 기능입니다.")}>
              결제하기
            </button>{" "}
            <Link href="/" className="btn">
              계속 쇼핑하기
            </Link>
          </>
        )}
      </div>

      <SiteFooter />
    </>
  );
}
