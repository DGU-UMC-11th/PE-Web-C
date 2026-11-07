package com.umc.study.service;

import com.umc.study.domain.Member;
import com.umc.study.domain.Rating;
import com.umc.study.dto.CreateRatingRequest;
import com.umc.study.dto.RatingResponse;
import com.umc.study.dto.UpdateRatingRequest;
import com.umc.study.exception.DuplicateException;
import com.umc.study.repository.MemberRepository;
import com.umc.study.repository.RatingRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.PageRequest;
import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.server.ResponseStatusException;

import java.util.List;

@Service
@RequiredArgsConstructor
@Transactional(readOnly = true)
public class RatingService {

    private final RatingRepository ratingRepository;
    private final MemberRepository memberRepository;

    public List<RatingResponse> getRatingsByMember(Long memberId, Integer page, Integer size) {
        // 없는 유저인데 빈 배열을 주면 "평점이 없는 유저"와 구분이 안 돼요.
        if (!memberRepository.existsById(memberId)) {
            throw new ResponseStatusException(HttpStatus.NOT_FOUND, "존재하지 않는 유저입니다.");
        }

        List<Rating> ratings = (page == null || size == null)
                ? ratingRepository.findByMember_MemberIdOrderByRatingIdDesc(memberId)
                : ratingRepository.findByMember_MemberIdOrderByRatingIdDesc(memberId, PageRequest.of(page, size));

        return ratings.stream().map(RatingResponse::from).toList();
    }

    @Transactional
    public Long create(Long memberId, CreateRatingRequest request) {
        Member member = memberRepository.findById(memberId)
                .orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND, "존재하지 않는 유저입니다."));

        // rating 테이블에는 (member_id, movie_id) 복합 UNIQUE 제약이 걸려 있어요.
        // 그냥 저장해도 DB가 막아주지만, 우리가 정한 메시지로 응답하려고 먼저 확인해요.
        if (ratingRepository.existsByMember_MemberIdAndMovieId(memberId, request.movieId())) {
            throw DuplicateException.rating();
        }

        Rating rating = Rating.builder()
                .member(member)
                .movieId(request.movieId())
                .score(request.score())
                .comment(request.comment())
                .build();

        return ratingRepository.save(rating).getRatingId();
    }

    @Transactional
    public void update(Long ratingId, Long memberId, UpdateRatingRequest request) {
        Rating rating = findOwnedRating(ratingId, memberId);
        rating.update(request.score(), request.comment());
        ratingRepository.save(rating);
    }

    @Transactional
    public void delete(Long ratingId, Long memberId) {
        Rating rating = findOwnedRating(ratingId, memberId);
        ratingRepository.delete(rating);
    }

    /**
     * 평점을 찾고, 그 평점이 요청자의 것인지까지 확인해요.
     * 수정과 삭제가 똑같은 검사를 하므로 메서드로 묶었어요.
     * 먼저 찾아보고(없으면 404), 찾았으면 주인을 봐요(내 것이 아니면 403).
     */
    private Rating findOwnedRating(Long ratingId, Long memberId) {
        Rating rating = ratingRepository.findById(ratingId)
                .orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND, "존재하지 않는 평점입니다."));

        if (!rating.getMember().getMemberId().equals(memberId)) {
            throw new ResponseStatusException(HttpStatus.FORBIDDEN, "본인이 작성한 평점만 수정하거나 삭제할 수 있습니다.");
        }

        return rating;
    }
}
