import type { AppProps } from "next/app";
import { AuthProvider } from "@/context/AuthContext";
import { CartProvider } from "@/context/CartContext";
import "../styles.css";

// 모든 페이지를 감싸는 곳. 로그인 정보랑 장바구니를 어디서나 쓸수 있게 함
export default function App({ Component, pageProps }: AppProps) {
  return (
    <AuthProvider>
      <CartProvider>
        <Component {...pageProps} />
      </CartProvider>
    </AuthProvider>
  );
}
