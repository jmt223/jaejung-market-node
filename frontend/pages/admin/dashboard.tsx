import Head from "next/head";
import Link from "next/link";
import AdminLogoutLink from "@/components/AdminLogoutLink";
import { useAdmin } from "@/lib/hooks";
import { AdminMe } from "@/lib/types";

// 관리자 대시보드
export default function AdminDashboard() {
  const { data: admin } = useAdmin<AdminMe>("/api/admin/me");

  return (
    <>
      <Head>
        <title>관리자 대시보드 - 재중마켓</title>
      </Head>
      {admin && (
        <div className="admin-container">
          <h1>관리자 대시보드</h1>
          <p>환영합니다, {admin.username}!</p>
          <ul>
            {/* 메뉴만 숨기는 것이고 실제 권한 검사는 서버에서 함 */}
            {admin.role !== "INQUIRY_ADMIN" && (
              <>
                <li>
                  <Link href="/admin/users" className="nav-link">
                    사용자 관리
                  </Link>
                </li>
                <li>
                  <Link href="/admin/management" className="nav-link">
                    관리자 관리
                  </Link>
                </li>
                <li>
                  <Link href="/admin/products" className="nav-link">
                    상품 관리
                  </Link>
                </li>
                <li>
                  <Link href="/admin/notice" className="nav-link">
                    공지사항 관리
                  </Link>
                </li>
              </>
            )}
            <li>
              <AdminLogoutLink />
            </li>
          </ul>
        </div>
      )}
    </>
  );
}
