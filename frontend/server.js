// 프론트 서버 시작하는 곳 (next start 대신 이걸로 띄움)
// Rocky 서버에서 브라우저가 여기(3000)로 바로 붙음. 앞에 다른 서버(프록시)는 없음
// next가 빌드하는 파일이 아니라 node 로 바로 실행하는 파일이라 import 대신 require 씀
/* eslint-disable @typescript-eslint/no-require-imports */
const http = require("http");
const next = require("next");

const port = 3000;
const hostname = "0.0.0.0";

const app = next({ dev: false, hostname: hostname, port: port });
const handle = app.getRequestHandler();

// [보안조치] (6) 관리자 페이지 분리 여부
// 그냥 next start 로 띄우면 사용자가 보낸 X-Forwarded-For 헤더가 그대로 남아서
// 헤더에 관리자 IP 적어서 보내면 관리자 페이지 IP 제한이 뚫렸음
// 사용자가 보낸 프록시 헤더는 다 지우고 진짜 접속 IP(소켓 주소)로 다시 넣음. 스프링 getRemoteAddr() 랑 같음
const PROXY_HEADERS = ["x-forwarded-for", "x-forwarded-host", "x-forwarded-proto", "x-forwarded-port", "x-real-ip", "forwarded"];

app.prepare().then(() => {
  const server = http.createServer((req, res) => {
    for (let i = 0; i < PROXY_HEADERS.length; i++) {
      delete req.headers[PROXY_HEADERS[i]];
    }
    req.headers["x-forwarded-for"] = req.socket.remoteAddress;

    handle(req, res);
  });

  server.listen(port, hostname, () => {
    console.log("프론트 서버 시작 : " + hostname + ":" + port);
  });
});
