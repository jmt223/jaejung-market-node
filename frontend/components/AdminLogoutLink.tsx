import Link from "next/link";
import { useRouter } from "next/router";
import { MouseEvent } from "react";
import { apiPost } from "@/lib/api";

// 관리자 로그아웃 링크
export default function AdminLogoutLink() {
  const router = useRouter();

  const onClick = async (event: MouseEvent) => {
    event.preventDefault();
    await apiPost("/api/admin/logout");
    await router.push("/admin/login");
  };

  return (
    <Link href="/admin/login" className="nav-link" onClick={onClick}>
      로그아웃
    </Link>
  );
}
