import Head from "next/head";
import Link from "next/link";
import SiteFooter from "@/components/SiteFooter";
import SiteHeader from "@/components/SiteHeader";
import { formatDate } from "@/lib/format";
import { useProtected } from "@/lib/hooks";
import { Notice } from "@/lib/types";

// 공지사항 목록
export default function NoticeList() {
  const { data: notices } = useProtected<Notice[]>("/api/notices");

  return (
    <>
      <Head>
        <title>공지사항 - 재중마켓</title>
      </Head>
      <SiteHeader />
      <div className="notice-container">
        {/* 공지 목록. 공지 없으면 아래쪽 문구 나옴 */}
        <h2>공지사항</h2>
        {notices &&
          notices.map((notice) => (
            <div className="notice-item" key={notice.id}>
              <Link href={`/notice/${notice.id}`} className="notice-title">
                {notice.title}
              </Link>
              <p className="notice-meta">작성일: {formatDate(notice.createdAt)}</p>
            </div>
          ))}
        {notices && notices.length === 0 && <p>등록된 공지사항이 없습니다.</p>}
      </div>
      <SiteFooter />
    </>
  );
}
