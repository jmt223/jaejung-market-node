import Head from "next/head";
import Link from "next/link";
import { useRouter } from "next/router";
import { FormEvent } from "react";
import SiteFooter from "@/components/SiteFooter";
import SiteHeader from "@/components/SiteHeader";
import { apiPost } from "@/lib/api";
import { formValues } from "@/lib/format";
import { useProtected, useSubmit } from "@/lib/hooks";
import { UserInfo } from "@/lib/types";

// 마이페이지 수정
export default function MypageEdit() {
  const router = useRouter();
  const { data: user, mutate } = useProtected<UserInfo>("/api/mypage");
  const { error, run } = useSubmit();

  // 폼 제출하면 실행됨
  const onSubmit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const values = formValues(event.currentTarget);
    void run(async () => {
      await apiPost("/api/mypage/edit", values);
      await mutate();
      await router.push("/mypage");
    });
  };

  return (
    <>
      <Head>
        <title>마이페이지 수정 - 재중마켓</title>
      </Head>
      <SiteHeader />
      <div className="mypage-container">
        <h1>마이페이지 정보 수정</h1>
        {error && <p style={{ color: "red" }}>{error}</p>}
        {user && (
          <form onSubmit={onSubmit} key={user.id}>
            <label>
              아이디: <input type="text" value={user.username} disabled readOnly />
            </label>
            <br />
            <label>
              이름: <input type="text" name="name" defaultValue={user.name} required />
            </label>
            <br />
            <label>
              생년월일: <input type="date" name="birthdate" defaultValue={user.birthdate} required />
            </label>
            <br />
            <label>
              전화번호: <input type="text" name="phoneNumber" defaultValue={user.phoneNumber} required />
            </label>
            <br />
            <label>
              비밀번호 변경 (선택): <input type="password" name="password" placeholder="변경 시에만 입력" />
            </label>
            <br />
            <button type="submit" className="btn">
              저장
            </button>
          </form>
        )}
        <Link href="/mypage" className="btn">
          마이페이지로 돌아가기
        </Link>
      </div>
      <SiteFooter />
    </>
  );
}
