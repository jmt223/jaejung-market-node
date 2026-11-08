import Head from "next/head";
import Link from "next/link";
import { useRouter } from "next/router";
import ErrorPage from "@/components/ErrorPage";
import SiteFooter from "@/components/SiteFooter";
import SiteHeader from "@/components/SiteHeader";
import { formatDate } from "@/lib/format";
import { useProtected } from "@/lib/hooks";
import { Notice } from "@/lib/types";

// 공지사항 상세
export default function NoticeDetail() {
  const router = useRouter();
  const { id } = router.query;
  const { data: notice, error } = useProtected<Notice>(router.isReady ? `/api/notices/${id}` : null);

  // 없는 공지면 공통 에러페이지 (로그인 안한건 useProtected 에서 로그인 페이지로 보냄)
  if (error && error.status !== 401) {
    return <ErrorPage />;
  }

  return (
    <>
      <Head>
        <title>공지사항 상세 - 재중마켓</title>
      </Head>
      <SiteHeader />
      {notice && (
        <div className="notice-container">
          {/* [보안조치] (1) Stored XSS 나왔던 화면. 입력할때 특수문자 치환하고 React가 문자열로만 출력해서 스크립트가 실행되지 않음 */}
          <h2>{notice.title}</h2>
          <p className="notice-meta">작성일: {formatDate(notice.createdAt)}</p>
          <p>{notice.content}</p>
          <Link href="/notice" className="btn">
            목록으로
          </Link>
        </div>
      )}
      <SiteFooter />
    </>
  );
}
