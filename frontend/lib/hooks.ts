import { useRouter } from "next/router";
import { useCallback, useEffect, useState } from "react";
import useSWR from "swr";
import { ApiError, apiGet } from "./api";

// 로그인 해야 볼수 있는 데이터 가져오기
// 로그인 안했으면 로그인 페이지로, 권한 없으면 대시보드로 보냄
export function useProtected<T>(url: string | null, loginPath = "/login") {
  const router = useRouter();
  // dedupingInterval 0 : 이거 없으면 글 등록하고 목록으로 왔을때 옛날 목록이 보임
  const result = useSWR<T, ApiError>(url, apiGet, {
    shouldRetryOnError: false,
    revalidateOnFocus: false,
    dedupingInterval: 0,
  });
  const { error } = result;

  useEffect(() => {
    if (error?.status === 401) {
      void router.replace(loginPath);
    } else if (error?.status === 403) {
      void router.replace("/admin/dashboard");
    }
  }, [error, loginPath, router]);

  return result;
}

// 관리자 페이지용
export function useAdmin<T>(url: string | null) {
  return useProtected<T>(url, "/admin/login");
}

// 폼 제출할때 공통으로 쓰는거. 에러 메시지 넣어주고 로그인 풀렸으면 로그인 페이지로 보냄
export function useSubmit(loginPath = "/login") {
  const router = useRouter();
  const [error, setError] = useState("");

  const run = useCallback(
    async (action: () => Promise<void>) => {
      setError("");
      try {
        await action();
      } catch (e) {
        if (e instanceof ApiError && e.status === 401) {
          void router.replace(loginPath);
        } else if (e instanceof ApiError && e.status === 403) {
          void router.replace("/admin/dashboard");
        } else {
          setError(e instanceof Error ? e.message : "요청을 처리하지 못했습니다.");
        }
      }
    },
    [loginPath, router],
  );

  return { error, setError, run };
}

export function useAdminSubmit() {
  return useSubmit("/admin/login");
}
