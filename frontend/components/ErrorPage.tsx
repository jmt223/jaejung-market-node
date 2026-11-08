import Head from "next/head";
import Link from "next/link";

// [보안조치] (10) 일괄적인 오류 처리 : 에러가 나도 내용은 안보여주고 이 화면만 보여줌
export default function ErrorPage() {
  return (
    <>
      <Head>
        <title>오류 발생</title>
      </Head>
      <div className="error-page">
        <div className="error-container">
          <h1>죄송합니다.</h1>
          <p>요청하신 페이지에서 문제가 발생했습니다.</p>
          <p>잠시 후 다시 시도해 주세요.</p>
          <Link href="/">홈으로 돌아가기</Link>
        </div>
      </div>
    </>
  );
}
