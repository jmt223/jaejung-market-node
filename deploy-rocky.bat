@echo off
chcp 65001 > nul
cd /d "%~dp0"

rem 재중마켓 Node 버전 Rocky Linux 서버에 올리기
rem 앱 서버 : 192.168.100.20 (프론트 3000, 백엔드 127.0.0.1:4000)
rem DB 서버 : 192.168.100.30 (sampledb, 스프링이랑 같이 씀) -> 처음 한번은 database\setup-db.bat 먼저 실행
rem 비밀번호는 파일에 안 적음. 중간에 rocky 계정 비밀번호 물어보면 입력하면 됨 (pscp 3번, 접속 1번, sudo 1번)
rem 필요한것 : PuTTY (plink, pscp), 내 PC에 node / npm

set SERVER=rocky@192.168.100.20
set IMAGES=..\jmt223_조치 후\uploads

echo [1/5] 백엔드 빌드
cd backend
call npm run build
if errorlevel 1 goto fail
cd ..

echo [2/5] 프론트 빌드
cd frontend
call npm run build
if errorlevel 1 goto fail
cd ..

rem node_modules 는 안 보냄. 서버에서 npm install 로 리눅스용으로 다시 받음
echo [3/5] 압축
tar -czf "%TEMP%\node-backend.tgz" -C backend dist package.json package-lock.json .env
if errorlevel 1 goto fail
tar -czf "%TEMP%\node-frontend.tgz" --exclude=.next/cache -C frontend .next public package.json package-lock.json next.config.js server.js .env.local
if errorlevel 1 goto fail

echo [4/5] 서버 /tmp 로 복사 (상품 샘플 이미지는 스프링 프로젝트 uploads 폴더에서 가져감)
pscp "%TEMP%\node-backend.tgz" "%TEMP%\node-frontend.tgz" deploy\setup-server.sh %SERVER%:/tmp/
if errorlevel 1 goto fail
pscp "%IMAGES%\sample*.png" %SERVER%:/tmp/
if errorlevel 1 goto fail

echo [5/5] 서버에서 설치하고 서비스 다시 띄움
plink -t %SERVER% "sudo bash /tmp/setup-server.sh; rm -f /tmp/setup-server.sh"
if errorlevel 1 goto fail

del "%TEMP%\node-backend.tgz" "%TEMP%\node-frontend.tgz"
echo 끝. 10초쯤 뒤에 http://192.168.100.20:3000 접속
pause
exit /b

:fail
echo 중간에 실패했습니다. 위에 나온 에러 확인하기
pause
