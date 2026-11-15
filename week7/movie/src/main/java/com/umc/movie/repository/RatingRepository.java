package com.umc.movie.repository;

import com.umc.movie.entity.Rating;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface RatingRepository extends JpaRepository<Rating, Long> {

    // rating.member.memberId = ? 인 평점을 rating_id 내림차순(최신순)으로
    List<Rating> findByMember_MemberIdOrderByRatingIdDesc(Long memberId);

    // (member_id, movie_id) 복합 UNIQUE와 같은 조건. DB가 막아 주지만, 우리가 정한 메시지로 응답하려고 먼저 확인해요.
    boolean existsByMember_MemberIdAndMovieId(Long memberId, Long movieId);
}
