import { NextRequest, NextResponse } from "next/server";

// 쉼표로 자르기
function splitCsv(value?: string): string[] {
  const result: string[] = [];
  if (!value) {
    return result;
  }

  const items = value.split(",");
  for (let i = 0; i < items.length; i++) {
    const item = items[i].trim();
    if (item !== "") {
      result.push(item);
    }
  }
  return result;
}

// 접속한 사람 IP 구하기
// X-Forwarded-For 는 server.js 에서 사용자가 보낸걸 지우고 진짜 접속 IP 하나만 넣어둔 값이라 조작이 안됨
function getClientIp(request: NextRequest): string {
  let ip = request.headers.get("x-forwarded-for") || "";
  // ipv4가 ::ffff:192.168.100.1 이렇게 들어올때가 있어서 앞부분 지움
  ip = ip.replace("::ffff:", "");
  return ip;
}

// [보안조치] (6) 관리자 페이지 분리 여부
// 데이터는 백엔드에서 막는데 관리자 화면 자체도 안보이게 여기서도 막음
export function middleware(request: NextRequest) {
  const allowedIps = splitCsv(process.env.ADMIN_ALLOWED_IPS);

  if (!allowedIps.includes(getClientIp(request))) {
    // 403을 주면 관리자 페이지가 있다는게 티나니까 그냥 없는 페이지처럼 404로 보냄
    return NextResponse.rewrite(new URL("/404", request.url), { status: 404 });
  }
  return NextResponse.next();
}

export const config = {
  matcher: ["/admin", "/admin/:path*"],
};
