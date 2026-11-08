import Head from "next/head";
import Link from "next/link";
import { useRouter } from "next/router";
import { FormEvent } from "react";
import { apiPost } from "@/lib/api";
import { formValues } from "@/lib/format";
import { useAdmin, useAdminSubmit } from "@/lib/hooks";
import { Notice } from "@/lib/types";

// 새 공지 작성
export default function AdminNoticeNew() {
  const router = useRouter();
  const { error, run } = useAdminSubmit();
  // 권한 없는 관리자가 URL로 들어오면 대시보드로 돌려보내기 위한 조회
  const { data } = useAdmin<Notice[]>("/api/admin/notices");

  // 폼 제출하면 실행됨
  const onSubmit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const values = formValues(event.currentTarget);
    void run(async () => {
      await apiPost("/api/admin/notices", values);
      await router.push("/admin/notice");
    });
  };

  if (!data) {
    return null;
  }

  return (
    <>
      <Head>
        <title>새 공지 작성 - 재중마켓</title>
      </Head>
      <div className="admin-container">
        <h1>새 공지 작성</h1>
        {error && <p style={{ color: "red" }}>{error}</p>}
        <form onSubmit={onSubmit}>
          <label>
            제목: <input type="text" name="title" required />
          </label>
          <br />
          <br />
          <label>
            내용:
            <br />
            <textarea name="content" rows={5} cols={50} required />
          </label>
          <br />
          <br />
          <button type="submit" className="btn">
            등록
          </button>
        </form>
        <Link href="/admin/notice" className="btn">
          공지사항 관리로 돌아가기
        </Link>
      </div>
    </>
  );
}
