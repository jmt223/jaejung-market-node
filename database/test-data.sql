-- 재중마켓 테스트 데이터
-- schema.sql 로 만든 빈 DB에 한번만 넣기. 이미 데이터가 있으면 id가 겹쳐서 에러나고 멈춤
--
-- 사용자 : kimminsu, leejiyoung, parkjunho, ab / 비밀번호 Test1234!
--          special01 / 비밀번호 P@ss<w>o"rd&1
--          lockeduser / 비밀번호 Test1234! (잠긴 계정)
-- 관리자 : superadmin / 비밀번호 Admin1234!
--          lockedadmin / 비밀번호 Admin1234! (잠긴 계정)
USE sampledb;
SET NAMES utf8mb4;

INSERT INTO admins (id, username, password, role, failed_attempts, account_locked) VALUES (1, 'superadmin', '$2b$10$aH0nV9xt5MkUmAAFmOuOje9/8DPlbM2.V6zq43mpL2r1sfjo9j5tC', 'SUPER_ADMIN', 0, 0);
INSERT INTO admins (id, username, password, role, failed_attempts, account_locked) VALUES (2, 'lockedadmin', '$2b$10$aH0nV9xt5MkUmAAFmOuOje9/8DPlbM2.V6zq43mpL2r1sfjo9j5tC', 'SUPER_ADMIN', 5, 1);

INSERT INTO users (id, username, password, name, birthdate, phone_number, failed_attempts, account_locked) VALUES (1, 'kimminsu', '$2b$10$vSWDMyOXY4kNZ5Krm67LvOKbvn2.sra9rMY1GwiwE9xs9LyUTdkI2', '김민수', '1995-03-12', '01011112222', 0, 0);
INSERT INTO users (id, username, password, name, birthdate, phone_number, failed_attempts, account_locked) VALUES (2, 'leejiyoung', '$2b$10$vSWDMyOXY4kNZ5Krm67LvOKbvn2.sra9rMY1GwiwE9xs9LyUTdkI2', '이지영', '1998-07-25', '01022223333', 0, 0);
INSERT INTO users (id, username, password, name, birthdate, phone_number, failed_attempts, account_locked) VALUES (3, 'parkjunho', '$2b$10$vSWDMyOXY4kNZ5Krm67LvOKbvn2.sra9rMY1GwiwE9xs9LyUTdkI2', '박준호', '2000-11-02', '01033334444', 0, 0);
INSERT INTO users (id, username, password, name, birthdate, phone_number, failed_attempts, account_locked) VALUES (4, 'lockeduser', '$2b$10$vSWDMyOXY4kNZ5Krm67LvOKbvn2.sra9rMY1GwiwE9xs9LyUTdkI2', '잠금사용자', '1990-01-01', '01044445555', 5, 1);
INSERT INTO users (id, username, password, name, birthdate, phone_number, failed_attempts, account_locked) VALUES (5, 'ab', '$2b$10$vSWDMyOXY4kNZ5Krm67LvOKbvn2.sra9rMY1GwiwE9xs9LyUTdkI2', '짧은아이디', '1992-05-05', '01055556666', 0, 0);
INSERT INTO users (id, username, password, name, birthdate, phone_number, failed_attempts, account_locked) VALUES (6, 'special01', '$2b$10$idHt49.Qb9mFCWCvtPvYLu5p3vD55lEDaOtXpTY9cidwMB6kTF/1K', '<b>특수이름</b>', '1999-12-31', '01066667777', 0, 0);

INSERT INTO post (id, title, content, user_id, file_name, price, stock, category) VALUES (1, '나이키 에어포스 1 화이트', '정품 박스 포함입니다. 3회 착용했어요.', 1, 'sample01.png', 89000, 5, '신발');
INSERT INTO post (id, title, content, user_id, file_name, price, stock, category) VALUES (2, '구찌 마몬 숄더백', '백화점 구매 영수증 있습니다.', 1, 'sample02.png', 1250000, 1, '가방/지갑');
INSERT INTO post (id, title, content, user_id, file_name, price, stock, category) VALUES (3, '애플워치 SE 2세대', '배터리 효율 98%', 1, 'sample03.png', 230000, 3, '시계');
INSERT INTO post (id, title, content, user_id, file_name, price, stock, category) VALUES (4, '갤럭시 버즈2 프로', '미개봉 새상품', 1, 'sample04.png', 120000, 10, '디지털');
INSERT INTO post (id, title, content, user_id, file_name, price, stock, category) VALUES (5, '삼성 공기청정기', '필터 교체한지 한달 됐습니다', 1, 'sample05.png', 180000, 2, '가전제품');
INSERT INTO post (id, title, content, user_id, file_name, price, stock, category) VALUES (6, '빈티지 데님 자켓', '여성 M사이즈', 1, 'sample06.png', 35000, 8, '여성의류');
INSERT INTO post (id, title, content, user_id, file_name, price, stock, category) VALUES (7, '기모 맨투맨', '남성 L사이즈', 1, 'sample07.png', 25000, 12, '남성의류');
INSERT INTO post (id, title, content, user_id, file_name, price, stock, category) VALUES (8, '925 실버 반지', '호수 조절 가능', 1, 'sample08.png', 45000, 6, '쥬얼리');
INSERT INTO post (id, title, content, user_id, file_name, price, stock, category) VALUES (9, '실크 스카프', '선물용으로 좋아요', 1, 'sample09.png', 18000, 20, '패션 액세서리');
INSERT INTO post (id, title, content, user_id, file_name, price, stock, category) VALUES (10, '경량 캠핑 의자', '2개 세트', 1, 'sample10.png', 32000, 15, '스포츠/레저');
INSERT INTO post (id, title, content, user_id, file_name, price, stock, category) VALUES (11, '자전거 헬멧', '머리둘레 56cm', 1, 'sample11.png', 28000, 9, '차량/오토바이');
INSERT INTO post (id, title, content, user_id, file_name, price, stock, category) VALUES (12, '아이돌 포토카드 세트', '10장 묶음', 1, 'sample12.png', 15000, 30, '스타굿즈');
INSERT INTO post (id, title, content, user_id, file_name, price, stock, category) VALUES (13, '레고 테크닉 42115', '조립 완료품', 1, 'sample13.png', 98000, 4, '키덜트');
INSERT INTO post (id, title, content, user_id, file_name, price, stock, category) VALUES (14, '재즈 LP 음반', '상태 좋습니다', 1, 'sample14.png', 33000, 7, '음반/악기');
INSERT INTO post (id, title, content, user_id, file_name, price, stock, category) VALUES (15, '해리포터 전집', '1권부터 7권까지', 1, 'sample15.png', 52000, 3, '도서/티켓/문구');
INSERT INTO post (id, title, content, user_id, file_name, price, stock, category) VALUES (16, '매트 립스틱', '테스트만 해봤어요', 1, 'sample16.png', 19000, 25, '뷰티/미용');
INSERT INTO post (id, title, content, user_id, file_name, price, stock, category) VALUES (17, '원목 책상 1200', '직거래만 가능', 1, 'sample17.png', 150000, 2, '가구/인테리어');
INSERT INTO post (id, title, content, user_id, file_name, price, stock, category) VALUES (18, '스텐 전기포트', '1.7리터', 1, 'sample18.png', 27000, 11, '생활/주방용품');
INSERT INTO post (id, title, content, user_id, file_name, price, stock, category) VALUES (19, '무선 전동드릴', '배터리 2개 포함', 1, 'sample19.png', 69000, 5, '공구/산업용품');
INSERT INTO post (id, title, content, user_id, file_name, price, stock, category) VALUES (20, '제주 감귤 5kg', '산지직송', 1, 'sample20.png', 22000, 40, '식품');
INSERT INTO post (id, title, content, user_id, file_name, price, stock, category) VALUES (21, '유아 카시트', '신생아부터 사용 가능', 1, 'sample21.png', 140000, 3, '유아동/출산');
INSERT INTO post (id, title, content, user_id, file_name, price, stock, category) VALUES (22, '강아지 사료 6kg', '유통기한 넉넉합니다', 1, 'sample22.png', 31000, 18, '반려동물용품');
INSERT INTO post (id, title, content, user_id, file_name, price, stock, category) VALUES (23, '품절된 키보드', '재고가 없는 상품입니다', 1, 'sample23.png', 75000, 0, '디지털');
INSERT INTO post (id, title, content, user_id, file_name, price, stock, category) VALUES (24, '(특가) 가방 & 지갑 #1 ''A'' "B"', '특수문자가 들어간 상품 <b>굵게</b>', 1, 'sample24.png', 10000, 5, '가방/지갑');
INSERT INTO post (id, title, content, user_id, file_name, price, stock, category) VALUES (25, '<script>window.__xss=1</script><img src=x onerror=window.__xss=2>', '<img src=x onerror=window.__xss=3>', 1, NULL, 1000, 5, '키덜트');
INSERT INTO post (id, title, content, user_id, file_name, price, stock, category) VALUES (26, '아주 긴 상품명 아주 긴 상품명 아주 긴 상품명 아주 긴 상품명 아주 긴 상품명 아주 긴 상품명 아주 긴 상품명 아주 긴 상품명 아주 긴 상품명 아주 긴 상품명 아주 긴 상품명 아주 긴 상품명 아주 긴 상품명 아주 긴 상품명 아주 긴 상품명 아주 긴 상품명 아주 긴 상품명 아주 긴 상품명 아주 긴 상품명 아주 긴 상품명 아주 긴 상품명 아주 긴 상품명 아주 긴 상품명 아주 긴 상품명 아주 긴 상품명 ', '긴 상품명 화면 확인용', 1, NULL, 5000, 5, '키덜트');
INSERT INTO post (id, title, content, user_id, file_name, price, stock, category) VALUES (27, '작가 미상 유화', '수집품입니다', 1, 'sample27.png', 500000, 1, '예술/희귀/수집품');

INSERT INTO notice (id, title, content, admin_id) VALUES (1, '서비스 오픈 안내', '재중마켓이 오픈했습니다.', 1);
INSERT INTO notice (id, title, content, admin_id) VALUES (2, '배송 지연 안내', '연휴 기간에는 배송이 늦어질 수 있습니다.', 1);
INSERT INTO notice (id, title, content, admin_id) VALUES (3, '개인정보처리방침 변경', '11월 1일부터 변경됩니다.', 1);
INSERT INTO notice (id, title, content, admin_id) VALUES (4, '추석 연휴 고객센터 휴무', '연휴 기간 문의는 순차 답변합니다.', 1);
INSERT INTO notice (id, title, content, admin_id) VALUES (5, '<img src=x onerror=window.__xss=4>공지', '<script>window.__xss=5</script>본문', 1);
INSERT INTO notice (id, title, content, admin_id) VALUES (6, '정기 점검 안내', '매주 일요일 새벽 2시', 1);
INSERT INTO notice (id, title, content, admin_id) VALUES (7, '이벤트 당첨자 발표', '마이페이지에서 확인하세요.', 1);

INSERT INTO orders (id, user_id, total_amount) VALUES (1, 1, 139000);
INSERT INTO order_items (order_id, product_id, price, quantity) VALUES (1, 1, 89000, 1);
INSERT INTO order_items (order_id, product_id, price, quantity) VALUES (1, 7, 25000, 2);
INSERT INTO orders (id, user_id, total_amount) VALUES (2, 2, 22000);
INSERT INTO order_items (order_id, product_id, price, quantity) VALUES (2, 20, 22000, 1);

INSERT INTO cart (id, user_id, product_id, quantity) VALUES (1, 1, 4, 1);
INSERT INTO cart (id, user_id, product_id, quantity) VALUES (2, 1, 20, 2);
INSERT INTO cart (id, user_id, product_id, quantity) VALUES (3, 2, 16, 3);
