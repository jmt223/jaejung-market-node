-- 재중마켓 테스트 데이터 초기화 (sampledb)
-- 테스트하다가 데이터가 꼬였을때 실행. 재중마켓 테이블만 비우고 (memo 테이블은 안 건드림) test-data.sql 을 다시 넣으면 됨
-- 순서 : reset-data.sql -> test-data.sql
USE sampledb;

-- 외래키 걸린 테이블끼리 순서 상관없이 지우려고 잠깐 끔
SET FOREIGN_KEY_CHECKS = 0;
TRUNCATE TABLE order_items;
TRUNCATE TABLE orders;
TRUNCATE TABLE cart;
TRUNCATE TABLE notice;
TRUNCATE TABLE post;
TRUNCATE TABLE users;
TRUNCATE TABLE admins;
SET FOREIGN_KEY_CHECKS = 1;
