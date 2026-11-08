import Head from "next/head";
import Link from "next/link";
import SiteFooter from "@/components/SiteFooter";
import SiteHeader from "@/components/SiteHeader";
import { useProtected } from "@/lib/hooks";
import { UserInfo } from "@/lib/types";

// 마이페이지
export default function Mypage() {
  const { data: user } = useProtected<UserInfo>("/api/mypage");

  return (
    <>
      <Head>
        <title>마이페이지 - 재중마켓</title>
      </Head>

      <SiteHeader />

      <div className="mypage-container">
        <h1>마이페이지</h1>
        {user && (
          <>
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
            <Link href="/mypage/edit" className="btn">
              정보 수정
            </Link>
          </>
        )}
      </div>

      <SiteFooter />
    </>
  );
}
