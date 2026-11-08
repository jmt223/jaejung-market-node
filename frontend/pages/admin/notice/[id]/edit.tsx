import Head from "next/head";
import Link from "next/link";
import ErrorPage from "@/components/ErrorPage";
import { useRouter } from "next/router";
import { FormEvent } from "react";
import { apiPost } from "@/lib/api";
import { formValues } from "@/lib/format";
import { useAdmin, useAdminSubmit } from "@/lib/hooks";
import { Notice } from "@/lib/types";

// 공지사항 수정
export default function AdminNoticeEdit() {
  const router = useRouter();
  const { id } = router.query;
  const { error, run } = useAdminSubmit();
  const { data: notice, error: loadError } = useAdmin<Notice>(router.isReady ? `/api/admin/notices/${id}` : null);

  // 폼 제출하면 실행됨
  const onSubmit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const values = formValues(event.currentTarget);
    void run(async () => {
      await apiPost(`/api/admin/notices/${id}/edit`, values);
      await router.push("/admin/notice");
    });
  };

  // 없는 공지면 공통 에러페이지
  if (loadError && loadError.status === 404) {
    return <ErrorPage />;
  }

  return (
    <>
      <Head>
        <title>공지사항 수정 - 재중마켓</title>
      </Head>
      <div className="admin-container">
        <h1>공지사항 수정</h1>
        {error && <p style={{ color: "red" }}>{error}</p>}
        {notice && (
          <form onSubmit={onSubmit} key={notice.id}>
            <label>
              제목: <input type="text" name="title" defaultValue={notice.title} required />
            </label>
            <br />
            <br />
            <label>
              내용:
              <br />
              <textarea name="content" rows={5} cols={50} defaultValue={notice.content} required />
            </label>
            <br />
            <br />
            <button type="submit" className="btn">
              수정 완료
            </button>
          </form>
        )}
        <Link href="/admin/notice" className="btn">
          공지사항 관리로 돌아가기
        </Link>
      </div>
    </>
  );
}
