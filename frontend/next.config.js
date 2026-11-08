// Next 설정 파일
// 원래 next.config.ts 였는데 서버에서 실행할때 typescript 가 없으면 Next가 typescript를 설치하려고 해서 js로 바꿈

// 백엔드는 같은 서버에 127.0.0.1:4000 으로 떠있음
const backend = "http://127.0.0.1:4000";
const isDev = process.env.NODE_ENV !== "production";

let scriptSrc = "script-src 'self' 'unsafe-inline'";
let connectSrc = "connect-src 'self'";
if (isDev) {
  scriptSrc = scriptSrc + " 'unsafe-eval'";
  connectSrc = connectSrc + " ws:";
}

const contentSecurityPolicy = [
  "default-src 'self'",
  scriptSrc,
  "style-src 'self' 'unsafe-inline'",
  "img-src 'self' data:",
  "font-src 'self'",
  connectSrc,
  "object-src 'none'",
  "base-uri 'self'",
  "form-action 'self'",
  "frame-ancestors 'none'",
].join("; ");

/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  // [보안조치] (11) 서버 헤더 정보 노출 : X-Powered-By 제거
  poweredByHeader: false,

  // /api, /images 로 오는건 백엔드로 넘겨줌. 백엔드 주소를 밖에 안보여줘도 됨
  async rewrites() {
    return [
      { source: "/api/:path*", destination: backend + "/api/:path*" },
      { source: "/images/:path*", destination: backend + "/images/:path*" },
    ];
  },

  async headers() {
    return [
      {
        source: "/:path*",
        headers: [
          { key: "Content-Security-Policy", value: contentSecurityPolicy },
          { key: "X-Content-Type-Options", value: "nosniff" },
          { key: "X-Frame-Options", value: "DENY" },
          { key: "Referrer-Policy", value: "same-origin" },
        ],
      },
    ];
  },
};

module.exports = nextConfig;
