package com.umc.movie.dto;

import com.umc.movie.entity.Rating;

import java.time.LocalDateTime;

/**
 * Entity를 그대로 응답하면 DB 컬럼이 곧 API 계약이 돼버려요.
 * 화면에 필요한 필드만 골라 담는 응답 전용 타입이에요.
 */
public record RatingResponse(
        Long ratingId,
        Long movieId,
        Integer score,
        String comment,
        LocalDateTime createdAt,
        LocalDateTime updatedAt
) {
    public static RatingResponse from(Rating rating) {
        return new RatingResponse(
                rating.getRatingId(),
                rating.getMovieId(),
                rating.getScore(),
                rating.getComment(),
                rating.getCreatedAt(),
                rating.getUpdatedAt()
        );
    }
}
