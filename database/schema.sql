-- 재중마켓 DB 스키마 (Rocky Linux MySQL 192.168.100.30 / sampledb)
-- springuser 는 sampledb 에만 권한이 있어서 DB는 새로 안 만들고 sampledb 안에 테이블만 만듬
-- 처음 한번만 실행. 스프링 버전이랑 같은 테이블이라 스프링 쪽에서 이미 만들었으면 안해도 됨
-- 리눅스 MySQL은 테이블 이름 대소문자를 구분해서 엔티티(@Entity) 이름이랑 똑같이 전부 소문자로 씀
USE sampledb;

CREATE TABLE IF NOT EXISTS users (
    id              BIGINT       NOT NULL AUTO_INCREMENT PRIMARY KEY,
    username        VARCHAR(50)  NOT NULL UNIQUE,
    password        VARCHAR(255) NOT NULL,
    name            VARCHAR(100) NOT NULL,
    birthdate       DATE         NOT NULL,
    phone_number    VARCHAR(20)  NOT NULL,
    failed_attempts INT          NOT NULL DEFAULT 0,
    account_locked  TINYINT(1)   NOT NULL DEFAULT 0,
    session_id      VARCHAR(255)
) ENGINE = InnoDB;

CREATE TABLE IF NOT EXISTS admins (
    id              BIGINT       NOT NULL AUTO_INCREMENT PRIMARY KEY,
    username        VARCHAR(50)  NOT NULL UNIQUE,
    password        VARCHAR(255) NOT NULL,
    role            VARCHAR(50)  NOT NULL DEFAULT 'SUPER_ADMIN',
    failed_attempts INT          NOT NULL DEFAULT 0,
    account_locked  TINYINT(1)   NOT NULL DEFAULT 0,
    session_id      VARCHAR(255)
) ENGINE = InnoDB;

CREATE TABLE IF NOT EXISTS post (
    id         BIGINT       NOT NULL AUTO_INCREMENT PRIMARY KEY,
    title      VARCHAR(255) NOT NULL,
    content    TEXT         NOT NULL,
    created_at TIMESTAMP    NULL DEFAULT CURRENT_TIMESTAMP,
    user_id    BIGINT       NOT NULL,
    file_name  VARCHAR(255),
    price      INT,
    stock      INT,
    category   VARCHAR(100)
) ENGINE = InnoDB;

CREATE TABLE IF NOT EXISTS cart (
    id         BIGINT NOT NULL AUTO_INCREMENT PRIMARY KEY,
    user_id    BIGINT,
    product_id BIGINT,
    quantity   INT,
    CONSTRAINT cart_ibfk_1 FOREIGN KEY (user_id) REFERENCES users (id) ON DELETE CASCADE,
    CONSTRAINT cart_ibfk_2 FOREIGN KEY (product_id) REFERENCES post (id) ON DELETE CASCADE
) ENGINE = InnoDB;

CREATE TABLE IF NOT EXISTS orders (
    id           BIGINT NOT NULL AUTO_INCREMENT PRIMARY KEY,
    user_id      BIGINT,
    total_amount INT,
    CONSTRAINT orders_ibfk_1 FOREIGN KEY (user_id) REFERENCES users (id) ON DELETE CASCADE
) ENGINE = InnoDB;

CREATE TABLE IF NOT EXISTS order_items (
    id         BIGINT NOT NULL AUTO_INCREMENT PRIMARY KEY,
    order_id   BIGINT,
    product_id BIGINT,
    price      INT,
    quantity   INT,
    CONSTRAINT order_items_ibfk_1 FOREIGN KEY (order_id) REFERENCES orders (id) ON DELETE CASCADE,
    CONSTRAINT order_items_ibfk_2 FOREIGN KEY (product_id) REFERENCES post (id) ON DELETE CASCADE
) ENGINE = InnoDB;

CREATE TABLE IF NOT EXISTS notice (
    id         BIGINT       NOT NULL AUTO_INCREMENT PRIMARY KEY,
    title      VARCHAR(255) NOT NULL,
    content    TEXT         NOT NULL,
    created_at TIMESTAMP    NULL DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP    NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    admin_id   BIGINT,
    CONSTRAINT notice_ibfk_1 FOREIGN KEY (admin_id) REFERENCES admins (id)
) ENGINE = InnoDB;
