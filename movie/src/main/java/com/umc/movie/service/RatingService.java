// src/main/java/com/umc/movie/service/RatingService.java
package com.umc.movie.service;

import com.umc.movie.dto.CreateRatingRequest;
import com.umc.movie.dto.RatingResponse;
import com.umc.movie.dto.UpdateRatingRequest;
import com.umc.movie.entity.Member;
import com.umc.movie.entity.Rating;
import com.umc.movie.exception.ApiException;
import com.umc.movie.repository.MemberRepository;
import com.umc.movie.repository.RatingRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

@Service
@RequiredArgsConstructor
public class RatingService {

    private final RatingRepository ratingRepository;
    private final MemberRepository memberRepository;

    // 기존 회원별 평점 조회 및 페이지네이션 유지
    @Transactional(readOnly = true)
    public Page<RatingResponse> getRatingsByMember(
            Long memberId,
            int page,
            int size
    ) {
        if (!memberRepository.existsById(memberId)) {
            throw new ApiException(
                    HttpStatus.NOT_FOUND,
                    "MEMBER404_1",
                    "해당 회원을 찾을 수 없습니다."
            );
        }

        Pageable pageable = PageRequest.of(page, size);

        return ratingRepository
                .findByMember_MemberIdOrderByRatingIdDesc(
                        memberId,
                        pageable
                )
                .map(RatingResponse::from);
    }

    // JWT로 인증된 회원의 평점 등록
    @Transactional
    public RatingResponse createRating(
            Long memberId,
            CreateRatingRequest request
    ) {
        Member member = memberRepository.findById(memberId)
                .orElseThrow(() -> new ApiException(
                        HttpStatus.NOT_FOUND,
                        "MEMBER404_1",
                        "해당 회원을 찾을 수 없습니다."
                ));

        if (ratingRepository.existsByMember_MemberIdAndMovieId(
                memberId,
                request.movieId()
        )) {
            throw new ApiException(
                    HttpStatus.CONFLICT,
                    "RATING409_1",
                    "이미 이 영화에 평점을 남기셨습니다."
            );
        }

        Rating rating = new Rating(
                member,
                request.movieId(),
                request.score(),
                request.comment()
        );

        return RatingResponse.from(ratingRepository.save(rating));
    }

    // 본인이 작성한 평점만 수정
    @Transactional
    public RatingResponse updateRating(
            Long memberId,
            Long ratingId,
            UpdateRatingRequest request
    ) {
        Rating rating = findOwnedRating(memberId, ratingId);

        rating.update(request.score(), request.comment());

        return RatingResponse.from(rating);
    }

    // 본인이 작성한 평점만 삭제
    @Transactional
    public void deleteRating(Long memberId, Long ratingId) {
        Rating rating = findOwnedRating(memberId, ratingId);

        ratingRepository.delete(rating);
    }

    // 평점 존재 여부 및 작성자 소유권 검증
    private Rating findOwnedRating(Long memberId, Long ratingId) {
        Rating rating = ratingRepository.findById(ratingId)
                .orElseThrow(() -> new ApiException(
                        HttpStatus.NOT_FOUND,
                        "RATING404_1",
                        "해당 평점을 찾을 수 없습니다."
                ));

        if (!rating.getMember().getMemberId().equals(memberId)) {
            throw new ApiException(
                    HttpStatus.FORBIDDEN,
                    "RATING403_1",
                    "본인이 작성한 평점만 수정하거나 삭제할 수 있습니다."
            );
        }

        return rating;
    }
}

