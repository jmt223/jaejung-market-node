@echo off
chcp 65001 > nul
cd /d "%~dp0"

rem 재중마켓 테이블 만들고 테스트 데이터 넣기 (DB 서버 192.168.100.30 / sampledb)
rem 처음 한번만 실행. 이미 테이블이 있으면 test-data.sql 에서 id가 겹쳐서 에러남
rem 데이터만 처음 상태로 돌리고 싶으면 schema.sql 대신 reset-data.sql 을 먼저 넣으면 됨
rem 비밀번호 물어보는거 : rocky 계정 (pscp, 접속), MySQL root (mysql 2번)

set DBSERVER=rocky@192.168.100.30

echo [1/2] SQL 파일 DB 서버 /tmp 로 복사
pscp schema.sql test-data.sql %DBSERVER%:/tmp/
if errorlevel 1 goto fail

echo [2/2] 테이블 만들고 테스트 데이터 넣기
plink -t %DBSERVER% "mysql -uroot -p --default-character-set=utf8mb4 < /tmp/schema.sql && mysql -uroot -p --default-character-set=utf8mb4 < /tmp/test-data.sql; rm -f /tmp/schema.sql /tmp/test-data.sql"
if errorlevel 1 goto fail

echo 끝
pause
exit /b

:fail
echo 중간에 실패했습니다. 위에 나온 에러 확인하기
pause
