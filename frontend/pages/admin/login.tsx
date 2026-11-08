import Head from "next/head";
import { useRouter } from "next/router";
import { FormEvent, useState } from "react";
import { apiPost } from "@/lib/api";
import { formValues } from "@/lib/format";

// 관리자 로그인
export default function AdminLogin() {
  const router = useRouter();
  const [error, setError] = useState("");

  // 폼 제출하면 실행됨
  const onSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setError("");
    try {
      await apiPost("/api/admin/login", formValues(event.currentTarget));
      await router.push("/admin/dashboard");
    } catch (e) {
      setError(e instanceof Error ? e.message : "요청을 처리하지 못했습니다.");
    }
  };

  return (
    <>
      <Head>
        <title>관리자 로그인 - 재중마켓</title>
      </Head>
      <div className="auth-container">
        <h2>관리자 로그인</h2>
        {error && <p style={{ color: "red" }}>{error}</p>}
        <form onSubmit={onSubmit} className="auth-form">
          <label>
            아이디: <input type="text" name="username" required />
          </label>
          <label>
            비밀번호: <input type="password" name="password" required />
          </label>
          <button type="submit" className="auth-btn">
            로그인
          </button>
        </form>
      </div>
    </>
  );
}
