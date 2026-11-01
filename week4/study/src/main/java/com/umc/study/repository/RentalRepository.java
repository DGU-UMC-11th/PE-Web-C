package com.umc.study.repository;

import lombok.RequiredArgsConstructor;
import org.springframework.jdbc.core.JdbcTemplate;
import org.springframework.stereotype.Repository;

@Repository
@RequiredArgsConstructor
public class RentalRepository {

    private final JdbcTemplate jdbcTemplate;

    public int save(Long userId, Long bookId) {
        String sql = "INSERT INTO rental (user_id, book_id, rented_at, due_at) "
                + "VALUES (?, ?, NOW(), DATE_ADD(NOW(), INTERVAL 7 DAY))";

        // INSERT/UPDATE/DELETE는 update()를 사용하고, 반영된 행 개수를 돌려받습니다.
        return jdbcTemplate.update(sql, userId, bookId);
    }
}
