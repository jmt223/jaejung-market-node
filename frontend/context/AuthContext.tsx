import { useRouter } from "next/router";
import { createContext, ReactNode, useCallback, useContext, useMemo } from "react";
import useSWR from "swr";
import { apiGet, apiPost } from "@/lib/api";
import { LoginUser } from "@/lib/types";

interface AuthValue {
  user: LoginUser | null;
  isLoading: boolean;
  refresh: () => Promise<unknown>;
  logout: () => Promise<void>;
}

const AuthContext = createContext<AuthValue | null>(null);

// 로그인 정보 관리하는 곳
// 토큰이 httpOnly 쿠키라 js로 못읽어서 로그인 됐는지는 서버에 물어봐야됨
export function AuthProvider({ children }: { children: ReactNode }) {
  const router = useRouter();
  const { data, isLoading, mutate } = useSWR<{ user: LoginUser | null }>("/api/auth/me", apiGet, {
    shouldRetryOnError: false,
    revalidateOnFocus: false,
  });

  // 로그아웃하고 로그인 페이지로 이동
  const logout = useCallback(async () => {
    await apiPost("/api/auth/logout");
    await mutate({ user: null }, { revalidate: false });
    await router.push("/login");
  }, [mutate, router]);

  const value = useMemo(
    () => ({ user: data?.user ?? null, isLoading, refresh: mutate, logout }),
    [data, isLoading, mutate, logout],
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  const value = useContext(AuthContext);
  if (!value) {
    throw new Error("AuthProvider가 필요합니다.");
  }
  return value;
}
