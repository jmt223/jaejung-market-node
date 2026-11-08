import Head from "next/head";
import Link from "next/link";
import { apiPost } from "@/lib/api";
import { useAdmin, useAdminSubmit } from "@/lib/hooks";
import { UserInfo } from "@/lib/types";

// 사용자 관리
export default function AdminUsers() {
  const { data: users, mutate } = useAdmin<UserInfo[]>("/api/admin/users");
  const { error, run } = useAdminSubmit();

  // 삭제, 해제 버튼 눌렀을때
  // [보안조치] (1) XSS / CSRF 공격 가능성 : 스프링에서 GET 링크였던거 POST + 토큰으로 바꿈
  const act = (id: number, action: string, message?: string) => {
    if (message && !confirm(message)) {
      return;
    }
    void run(async () => {
      await apiPost(`/api/admin/users/${id}/${action}`);
      await mutate();
    });
  };

  return (
    <>
      <Head>
        <title>사용자 관리 - 재중마켓</title>
      </Head>
      <div className="admin-container">
        <h1>사용자 관리</h1>
        {error && <p style={{ color: "red" }}>{error}</p>}
        <Link href="/admin/users/new" className="btn">
          새 사용자 생성
        </Link>
        <table>
          <thead>
            <tr>
              <th>ID</th>
              <th>아이디</th>
              <th>이름</th>
              <th>생년월일</th>
              <th>전화번호</th>
              <th>상태</th>
              <th>액션</th>
            </tr>
          </thead>
          <tbody>
            {users?.map((user) => (
              <tr key={user.id}>
                <td>{user.id}</td>
                <td>{user.username}</td>
                <td>{user.name}</td>
                <td>{user.birthdate}</td>
                <td>{user.phoneNumber}</td>
                <td>{user.accountLocked ? <span style={{ color: "red" }}>잠김</span> : "정상"}</td>
                <td>
                  <Link href={`/admin/users/${user.id}`} className="btn">
                    보기
                  </Link>{" "}
                  <button type="button" className="btn" onClick={() => act(user.id, "delete", "정말 삭제하시겠습니까?")}>
                    삭제
                  </button>{" "}
                  {/* 잠긴 계정만 해제 버튼 나옴. 잠금은 로그인 5번 틀리면 자동으로 됨 */}
                  {user.accountLocked && (
                    <button type="button" className="btn" onClick={() => act(user.id, "unlock")}>
                      해제
                    </button>
                  )}
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
