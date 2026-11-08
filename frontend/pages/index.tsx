import Head from "next/head";
import Link from "next/link";
import { useRouter } from "next/router";
import useSWR from "swr";
import ProductGrid from "@/components/ProductGrid";
import SiteFooter from "@/components/SiteFooter";
import SiteHeader from "@/components/SiteHeader";
import { apiGet } from "@/lib/api";
import { CATEGORIES } from "@/lib/categories";
import { MainData } from "@/lib/types";

// 메인 페이지. 공지사항, 카테고리 필터, 상품 목록 (검색도 여기서 같이 함)
export default function Home() {
  const router = useRouter();
  const queryString = router.asPath.split("?")[1] ?? "";
  const { data, isLoading } = useSWR<MainData>(router.isReady ? `/api/main?${queryString}` : null, apiGet);

  let keyword = "";
  if (typeof router.query.keyword === "string") {
    keyword = router.query.keyword;
  }

  // 고른 카테고리 (스프링이랑 똑같이 하나만 고름)
  let selected = "";
  if (typeof router.query.category === "string") {
    selected = router.query.category;
  }

  return (
    <>
      <Head>
        <title>재중마켓</title>
      </Head>
      <SiteHeader keyword={keyword} />

      <div className="notice-section">
        <h2>공지사항</h2>
        {/* 5개 자르는건 백엔드(/api/main)에서 함 */}
        {data && data.topNotices.length > 0 && (
          <ul>
            {data.topNotices.map((notice) => (
              <li key={notice.id}>
                <Link href={`/notice/${notice.id}`}>{notice.title}</Link>
              </li>
            ))}
          </ul>
        )}
        {data && data.topNotices.length === 0 && <p>등록된 공지사항이 없습니다.</p>}
        <p>
          <Link href="/notice">공지사항 전체보기</Link>
        </p>
      </div>

      <div className="category-filter">
        <h2>카테고리 필터</h2>
        {/* 처음 렌더링 때는 주소값을 아직 못읽어서 router.isReady 되면 폼을 다시 그려야 선택이 유지됨 */}
        <form action="/" method="get" key={router.isReady ? queryString : "loading"}>
          <input type="hidden" name="keyword" value={keyword} />
          <div className="checkbox-group">
            <label>
              <input type="radio" name="category" value="" defaultChecked={selected === ""} />
              전체
            </label>
            {CATEGORIES.map((category) => (
              <label key={category}>
                <input type="radio" name="category" value={category} defaultChecked={selected === category} />
                {category}
              </label>
            ))}
          </div>
          <button type="submit" className="filter-btn">
            필터 적용
          </button>
        </form>
      </div>

      <div className="product-list-container">
        <h2>오늘의 상품 추천</h2>
        {!isLoading && data && data.posts.length === 0 && <p>상품이 없습니다.</p>}
        <ProductGrid posts={data ? data.posts : []} />
      </div>
      <SiteFooter />
    </>
  );
}
