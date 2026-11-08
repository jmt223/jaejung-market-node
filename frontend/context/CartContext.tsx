import { createContext, ReactNode, useCallback, useContext, useMemo } from "react";
import useSWR from "swr";
import { ApiError, apiGet, apiPost } from "@/lib/api";
import { CartItem } from "@/lib/types";
import { useAuth } from "./AuthContext";

interface CartValue {
  items: CartItem[];
  total: number;
  addToCart: (productId: number, quantity: number) => Promise<void>;
  updateQuantity: (cartId: number, quantity: number) => Promise<void>;
  removeItem: (cartId: number) => Promise<void>;
}

const CartContext = createContext<CartValue | null>(null);

// 장바구니 관리하는 곳. 상품 상세, 장바구니 화면에서 같이 씀
export function CartProvider({ children }: { children: ReactNode }) {
  const { user } = useAuth();
  const { data, mutate } = useSWR<CartItem[], ApiError>(user ? "/api/cart" : null, apiGet, {
    shouldRetryOnError: false,
  });

  // 장바구니 담기
  const addToCart = useCallback(
    async (productId: number, quantity: number) => {
      await apiPost("/api/cart/add", { productId, quantity });
      await mutate();
    },
    [mutate],
  );

  // 수량 변경
  const updateQuantity = useCallback(
    async (cartId: number, quantity: number) => {
      await apiPost("/api/cart/update", { cartId, quantity });
      await mutate();
    },
    [mutate],
  );

  // 삭제
  const removeItem = useCallback(
    async (cartId: number) => {
      await apiPost(`/api/cart/remove/${cartId}`);
      await mutate();
    },
    [mutate],
  );

  const value = useMemo(() => {
    const items = data ?? [];
    // 총 합계 계산
    let total = 0;
    for (const item of items) {
      total = total + item.price * item.quantity;
    }
    return { items, total, addToCart, updateQuantity, removeItem };
  }, [data, addToCart, updateQuantity, removeItem]);

  return <CartContext.Provider value={value}>{children}</CartContext.Provider>;
}

export function useCart() {
  const value = useContext(CartContext);
  if (!value) {
    throw new Error("CartProvider가 필요합니다.");
  }
  return value;
}
