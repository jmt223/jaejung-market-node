import Head from "next/head";
import Link from "next/link";
import { apiPost } from "@/lib/api";
import { useAdmin, useAdminSubmit } from "@/lib/hooks";
import { Notice } from "@/lib/types";

// 공지사항 관리
export default function AdminNoticeList() {
  const { data: notices, mutate } = useAdmin<Notice[]>("/api/admin/notices");
  const { error, run } = useAdminSubmit();

  // 삭제 버튼 눌렀을때
  // [보안조치] (1) XSS / CSRF 공격 가능성 : 스프링에서 GET 링크였던거 POST + 토큰으로 바꿈
  const remove = (id: number) => {
    if (confirm("정말 삭제하시겠습니까?")) {
      void run(async () => {
        await apiPost(`/api/admin/notices/${id}/delete`);
        await mutate();
      });
    }
  };

  return (
    <>
      <Head>
        <title>공지사항 관리 - 재중마켓</title>
      </Head>
      <div className="admin-container">
        <h1>공지사항 관리</h1>
        {error && <p style={{ color: "red" }}>{error}</p>}
        <Link href="/admin/notice/new" className="btn">
          새 공지 작성
        </Link>
        <table>
          <thead>
            <tr>
              <th>번호</th>
              <th>제목</th>
              <th>작성자</th>
              <th>수정</th>
              <th>삭제</th>
            </tr>
          </thead>
          <tbody>
            {notices?.map((notice) => (
              <tr key={notice.id}>
                <td>{notice.id}</td>
                <td>{notice.title}</td>
                <td>{notice.adminId}</td>
                <td>
                  <Link href={`/admin/notice/${notice.id}/edit`} className="btn">
                    수정
                  </Link>
                </td>
                <td>
                  <button type="button" className="btn" onClick={() => remove(notice.id)}>
                    삭제
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
        <br />
        <Link href="/admin/dashboard" className="btn">
          대시보드로 돌아가기
        </Link>
      </div>
    </>
  );
}
