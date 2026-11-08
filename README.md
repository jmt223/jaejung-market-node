# 재중마켓 (Node 버전)

Spring 재중마켓이랑 똑같이 동작하는 Node 버전. Rocky Linux 서버에서 돌아감

- backend : NestJS, TypeORM, MySQL, JWT (127.0.0.1:4000, 서버 안에서만 열림)
- frontend : Next.js, React, SWR (0.0.0.0:3000, 브라우저가 여기로 바로 붙음)
- DB : Spring 버전이랑 같은 sampledb (192.168.100.30) 를 같이 씀

## 주요 기능

**사용자**
- 회원가입 (아이디 중복확인), 로그인 / 로그아웃 (JWT 쿠키)
- 상품 목록 : 키워드 검색, 카테고리 필터, 페이징
- 상품 상세 보기
- 장바구니 담기 / 수량 변경 / 삭제
- 마이페이지 : 내 정보 보기, 수정
- 공지사항 목록 / 상세

**관리자**
- 관리자 로그인, 대시보드
- 상품 등록 / 수정 / 삭제 (이미지 업로드)
- 회원 목록 / 상세 / 등록 / 삭제, 잠긴 계정 풀기
- 관리자 계정 관리
- 공지사항 등록 / 수정 / 삭제

**보안**
- 비밀번호 bcrypt 암호화, 로그인 여러번 틀리면 계정 잠금
- XSS 필터, CSRF 토큰
- 관리자 페이지는 허용된 IP에서만 열림
- 업로드 파일 형식 / 크기 검사, 업로드 폴더는 웹 루트 밖에 둠
- 개인정보 마스킹

## 서버 구성

| 서버 | IP | 내용 |
|---|---|---|
| 앱 서버 | 192.168.100.20 | `/opt/jmt223-node` (backend, frontend, uploads), systemd 서비스 `jmt223-node-backend`, `jmt223-node-frontend`, 실행 계정 `jmt223node` |
| DB 서버 | 192.168.100.30 | MySQL 8.0, sampledb, 계정 springuser |

브라우저에서 http://192.168.100.20:3000 접속. 관리자는 http://192.168.100.20:3000/admin/login (허용 IP에서만 열림)

## 올리는 방법

1. DB 테이블이 없으면 `database\setup-db.bat` 먼저 실행 (스프링 쪽에서 이미 만들었으면 안해도 됨)
2. `deploy-rocky.bat` 실행. 빌드 -> 압축 -> 서버로 복사 -> `deploy/setup-server.sh` 실행까지 다 해줌
3. 처음 올릴때는 setup-server.sh 가 Node 서비스 계정, systemd 서비스, 방화벽 3000 포트까지 만들어줌

서버에 Node.js 22 가 깔려 있어야 됨 (`sudo dnf module enable nodejs:22 && sudo dnf install nodejs npm`)

## 테스트 데이터

`database/test-data.sql` 에 상품 27개, 공지 7개, 주문, 장바구니가 들어있음. 빈 DB에 한번만 넣기
데이터가 꼬이면 `database/reset-data.sql` 넣고 `test-data.sql` 다시 넣으면 처음 상태로 돌아감

| 구분 | 아이디 | 비밀번호 |
|---|---|---|
| 사용자 | kimminsu, leejiyoung, parkjunho, ab | Test1234! |
| 사용자 | special01 | P@ss<w>o"rd&1 |
| 잠긴 사용자 | lockeduser | Test1234! |
| 관리자 | superadmin | Admin1234! |
| 잠긴 관리자 | lockedadmin | Admin1234! |

## 설정

- `backend/.env` : DB 정보, JWT 키, 업로드 폴더, 관리자 허용 IP
- `frontend/.env.local` : 관리자 허용 IP (backend랑 똑같이 맞추기)
- `.env` 파일은 깃에 안올라감. 새로 받으면 `.env.example` 보고 만들기
- 관리자 PC가 바뀌면 `ADMIN_ALLOWED_IPS` 를 두군데 다 바꾸고 다시 올리기
- HTTPS 쓰게 되면 `COOKIE_SECURE=true`
