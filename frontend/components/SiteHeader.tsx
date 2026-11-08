import Link from "next/link";
import { MouseEvent } from "react";
import { useAuth } from "@/context/AuthContext";

interface Props {
  keyword?: string;
}

// 상단 메뉴. 사용자 화면은 전부 이거 하나 씀 (전에는 화면마다 메뉴가 달랐는데 하나로 맞춤)
export default function SiteHeader({ keyword = "" }: Props) {
  const { user, logout } = useAuth();

  const onLogout = (event: MouseEvent) => {
    event.preventDefault();
    void logout();
  };

  return (
    <header className="header">
      <div className="header-inner">
        <h1 className="logo">
          <Link href="/" className="home-link">
            재중마켓
          </Link>
        </h1>

        <form action="/" method="get" className="search-form" key={keyword}>
          <input
            type="text"
            name="keyword"
            defaultValue={keyword}
            className="search-input"
            placeholder="상품명, 지역명, 상점명 입력"
          />
          <button type="submit" className="search-btn">
            검색
          </button>
        </form>

        <nav className="nav">
          {user && (
            <>
              <span className="user-info">반가워, {user.username}!</span>
              <Link href="/mypage" className="nav-link">
                내 정보
              </Link>
              <Link href="/cart" className="nav-link">
                장바구니
              </Link>
              <Link href="/login" className="nav-link" onClick={onLogout}>
                로그아웃
              </Link>
            </>
          )}
          {!user && (
            <>
              <Link href="/login" className="nav-link">
                로그인
              </Link>
              <Link href="/register" className="nav-link">
                회원가입
              </Link>
            </>
          )}
        </nav>
      </div>
    </header>
  );
}
