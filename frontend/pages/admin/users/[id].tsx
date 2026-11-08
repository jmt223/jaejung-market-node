import Head from "next/head";
import Link from "next/link";
import ErrorPage from "@/components/ErrorPage";
import { useRouter } from "next/router";
import { useAdmin } from "@/lib/hooks";
import { UserInfo } from "@/lib/types";

// 사용자 상세
export default function AdminUserDetail() {
  const router = useRouter();
  const { id } = router.query;
  const { data: user, error } = useAdmin<UserInfo>(router.isReady ? `/api/admin/users/${id}` : null);

  // 없는 사용자면 공통 에러페이지
  if (error && error.status === 404) {
    return <ErrorPage />;
  }

  return (
    <>
      <Head>
        <title>사용자 상세 정보 - 재중마켓</title>
      </Head>
      <div className="admin-container">
        <h1>사용자 상세 정보</h1>
        {user && (
          <>
            <p>
              <strong>ID:</strong> {user.id}
            </p>
            <p>
              <strong>아이디:</strong> {user.username}
            </p>
            <p>
              <strong>이름:</strong> {user.name}
            </p>
            <p>
              <strong>생년월일:</strong> {user.birthdate}
            </p>
            <p>
              <strong>전화번호:</strong> {user.phoneNumber}
            </p>
          </>
        )}
        <Link href="/admin/users" className="btn">
          사용자 목록으로 돌아가기
        </Link>
      </div>
    </>
  );
}
