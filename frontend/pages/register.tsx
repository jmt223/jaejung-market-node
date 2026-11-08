import Head from "next/head";
import { useRouter } from "next/router";
import { FormEvent, useRef, useState } from "react";
import { apiGet, apiPost } from "@/lib/api";
import { formValues } from "@/lib/format";

// 회원가입 페이지
export default function Register() {
  const router = useRouter();
  const usernameRef = useRef<HTMLInputElement>(null);
  const [error, setError] = useState("");
  const [check, setCheck] = useState({ text: "", color: "red" });

  // 아이디 중복검사 버튼
  const checkUsername = async () => {
    const username = usernameRef.current?.value.trim() ?? "";
    if (username === "") {
      setCheck({ text: "아이디를 입력하세요.", color: "red" });
      return;
    }

    try {
      const { available } = await apiGet<{ available: boolean }>(
        `/api/auth/check-username?username=${encodeURIComponent(username)}`,
      );
      setCheck(
        available
          ? { text: "사용 가능한 아이디입니다.", color: "green" }
          : { text: "이미 사용 중인 아이디입니다.", color: "red" },
      );
    } catch {
      setCheck({ text: "오류가 발생했습니다.", color: "red" });
    }
  };

  // 폼 제출하면 실행됨
  const onSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setError("");
    try {
      await apiPost("/api/auth/register", formValues(event.currentTarget));
      await router.push("/login");
    } catch (e) {
      setError(e instanceof Error ? e.message : "요청을 처리하지 못했습니다.");
    }
  };

  return (
    <>
      <Head>
        <title>회원가입 - 재중마켓</title>
      </Head>
      <div className="auth-container">
        <h2>회원가입</h2>
        {error && <p style={{ color: "red" }}>{error}</p>}

        <form onSubmit={onSubmit} className="auth-form">
          <label>
            아이디: <input ref={usernameRef} type="text" id="username" name="username" required />
            <button type="button" onClick={checkUsername}>
              중복검사
            </button>
          </label>
          <p id="checkResult" style={{ fontSize: 14, color: check.color, marginTop: 4 }}>
            {check.text}
          </p>

          <label>
            비밀번호: <input type="password" name="password" required />
          </label>

          <label>
            이름: <input type="text" name="name" required />
          </label>

          <label>
            생년월일: <input type="date" name="birthdate" required />
          </label>

          <label>
            전화번호: <input type="text" name="phoneNumber" required />
          </label>

          <button type="submit" className="auth-btn">
            회원가입
          </button>
        </form>
      </div>
    </>
  );
}
