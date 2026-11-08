import Head from "next/head";
import Link from "next/link";
import { apiPost } from "@/lib/api";
import { useAdmin, useAdminSubmit } from "@/lib/hooks";
import { AdminAccount } from "@/lib/types";

// 관리자 관리
export default function AdminManagement() {
  const { data: admins, mutate } = useAdmin<AdminAccount[]>("/api/admin/management");
  const { error, run } = useAdminSubmit();

  // 삭제, 해제 버튼 눌렀을때
  // [보안조치] (1) XSS / CSRF 공격 가능성 : 스프링에서 GET 링크였던거 POST + 토큰으로 바꿈
  const act = (id: number, action: string, message?: string) => {
    if (message && !confirm(message)) {
      return;
    }
    void run(async () => {
      await apiPost(`/api/admin/management/${id}/${action}`);
      await mutate();
    });
  };

  return (
    <>
      <Head>
        <title>관리자 관리 - 재중마켓</title>
      </Head>
      <div className="admin-container">
        <h1>관리자 관리</h1>
        {error && <p style={{ color: "red" }}>{error}</p>}
        <table>
          <thead>
            <tr>
              <th>ID</th>
              <th>아이디</th>
              <th>상태</th>
              <th>관리</th>
            </tr>
          </thead>
          <tbody>
            {admins?.map((admin) => (
              <tr key={admin.id}>
                <td>{admin.id}</td>
                <td>{admin.username}</td>
                <td>{admin.accountLocked ? <span style={{ color: "red" }}>잠김</span> : "정상"}</td>
                <td>
                  <button type="button" className="btn" onClick={() => act(admin.id, "delete", "정말 삭제하시겠습니까?")}>
                    삭제
                  </button>{" "}
                  {/* 잠긴 계정만 해제 버튼 나옴. 잠금은 로그인 5번 틀리면 자동으로 됨 */}
                  {admin.accountLocked && (
                    <button type="button" className="btn" onClick={() => act(admin.id, "unlock")}>
                      해제
                    </button>
                  )}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
        <br />
        <Link href="/admin/management/new" className="btn">
          새 관리자 생성
        </Link>
        <br />
        <br />
        <Link href="/admin/dashboard" className="btn">
          대시보드로 돌아가기
        </Link>
      </div>
    </>
  );
}
