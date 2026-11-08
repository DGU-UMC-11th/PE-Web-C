package com.umc.movie.repository;

import com.umc.movie.entity.Rating;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface RatingRepository extends JpaRepository<Rating, Long> {

    // rating.member.memberId = ? 인 평점을 rating_id 내림차순(최신순)으로
    List<Rating> findByMember_MemberIdOrderByRatingIdDesc(Long memberId);
}
