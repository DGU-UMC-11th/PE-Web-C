-- 5주차 미션용 테이블. 기존 book/category/rental 과 같은 DB에 추가로 만들어요.
-- ddl-auto: validate 라서 엔티티와 컬럼이 정확히 맞아야 서버가 떠요.

CREATE TABLE IF NOT EXISTS member (
    member_id   BIGINT       NOT NULL AUTO_INCREMENT,
    email       VARCHAR(254) NOT NULL,
    password    VARCHAR(60)  NOT NULL,
    nickname    VARCHAR(50)  NOT NULL,
    created_at  DATETIME(6)  NOT NULL,
    updated_at  DATETIME(6)  NOT NULL,
    PRIMARY KEY (member_id),
    UNIQUE KEY uk_member_email (email),
    UNIQUE KEY uk_member_nickname (nickname)
);

CREATE TABLE IF NOT EXISTS rating (
    rating_id   BIGINT      NOT NULL AUTO_INCREMENT,
    member_id   BIGINT      NOT NULL,
    movie_id    BIGINT      NOT NULL,
    score       TINYINT     NOT NULL,
    comment     TEXT        NULL,
    created_at  DATETIME(6) NOT NULL,
    updated_at  DATETIME(6) NOT NULL,
    PRIMARY KEY (rating_id),
    UNIQUE KEY uk_rating_member_movie (member_id, movie_id),
    CONSTRAINT fk_rating_member FOREIGN KEY (member_id) REFERENCES member (member_id)
);
