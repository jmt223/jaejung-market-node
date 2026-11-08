import Head from "next/head";
import Link from "next/link";
import { useRouter } from "next/router";
import { FormEvent } from "react";
import { apiPost } from "@/lib/api";
import { formValues } from "@/lib/format";
import { useAdmin, useAdminSubmit } from "@/lib/hooks";
import { UserInfo } from "@/lib/types";

// 새 사용자 생성
export default function AdminUserNew() {
  const router = useRouter();
  const { error, run } = useAdminSubmit();
  // 권한 없는 관리자가 URL로 들어오면 대시보드로 돌려보내기 위한 조회
  const { data } = useAdmin<UserInfo[]>("/api/admin/users");

  // 폼 제출하면 실행됨
  const onSubmit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const values = formValues(event.currentTarget);
    void run(async () => {
      await apiPost("/api/admin/users/new", values);
      await router.push("/admin/users");
    });
  };

  if (!data) {
    return null;
  }

  return (
    <>
      <Head>
        <title>새 사용자 생성 - 재중마켓</title>
      </Head>
      <div className="auth-container">
        <h2>새 사용자 생성</h2>
        {error && <p style={{ color: "red" }}>{error}</p>}
        <form onSubmit={onSubmit} className="auth-form">
          <label>
            아이디: <input type="text" name="username" required />
          </label>
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
            생성
          </button>
        </form>
        <Link href="/admin/users" className="auth-link">
          사용자 목록으로 돌아가기
        </Link>
      </div>
    </>
  );
}
