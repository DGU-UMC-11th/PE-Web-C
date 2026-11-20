-- 8주차: 즐겨찾기 테이블.
-- (member_id, movie_id) 복합 UNIQUE라서 한 회원이 같은 영화를 두 번 즐겨찾기할 수 없어요.
-- movie_id만 UNIQUE로 걸면 한 영화를 서비스 전체에서 한 명만 즐겨찾기할 수 있게 돼요.

CREATE TABLE IF NOT EXISTS favorite (
    favorite_id BIGINT      NOT NULL AUTO_INCREMENT,
    member_id   BIGINT      NOT NULL,
    movie_id    BIGINT      NOT NULL,
    created_at  DATETIME(6) NOT NULL,
    updated_at  DATETIME(6) NOT NULL,
    PRIMARY KEY (favorite_id),
    UNIQUE KEY uk_favorite_member_movie (member_id, movie_id),
    CONSTRAINT fk_favorite_member FOREIGN KEY (member_id) REFERENCES member (member_id)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
