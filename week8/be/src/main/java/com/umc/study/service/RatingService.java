package com.umc.study.service;

import com.umc.study.domain.Member;
import com.umc.study.domain.Rating;
import com.umc.study.dto.CreateRatingRequest;
import com.umc.study.dto.RatingResponse;
import com.umc.study.dto.UpdateRatingRequest;
import com.umc.study.exception.ApiException;
import com.umc.study.repository.MemberRepository;
import com.umc.study.repository.RatingRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.PageRequest;
import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;

@Service
@RequiredArgsConstructor
@Transactional(readOnly = true)
public class RatingService {

    private final RatingRepository ratingRepository;
    private final MemberRepository memberRepository;

    // 5주차에 만든 공개 조회예요. 예외만 ApiException으로 바꿨어요.
    public List<RatingResponse> getRatingsByMember(Long memberId, Integer page, Integer size) {
        if (!memberRepository.existsById(memberId)) {
            throw new ApiException(HttpStatus.NOT_FOUND, "MEMBER404_1",
                    "해당 회원을 찾을 수 없습니다.");
        }

        List<Rating> ratings = (page == null || size == null)
                ? ratingRepository.findByMember_MemberIdOrderByRatingIdDesc(memberId)
                : ratingRepository.findByMember_MemberIdOrderByRatingIdDesc(memberId, PageRequest.of(page, size));

        return ratings.stream().map(RatingResponse::from).toList();
    }

    // 7주차부터 memberId는 요청이 아니라 토큰에서 와요. 그래서 "누가"가 항상 맨 앞 인자예요.
    @Transactional
    public RatingResponse create(Long memberId, CreateRatingRequest request) {
        Member member = memberRepository.findById(memberId)
                .orElseThrow(() -> new ApiException(HttpStatus.NOT_FOUND, "MEMBER404_1",
                        "해당 회원을 찾을 수 없습니다."));

        // rating 테이블에는 (member_id, movie_id) 복합 UNIQUE 제약이 걸려 있어요.
        // 그냥 저장해도 DB가 막아주지만, 우리가 정한 메시지로 응답하려고 먼저 확인해요.
        if (ratingRepository.existsByMember_MemberIdAndMovieId(memberId, request.movieId())) {
            throw new ApiException(HttpStatus.CONFLICT, "RATING409_1",
                    "이미 이 영화에 평점을 남기셨습니다.");
        }

        Rating rating = Rating.builder()
                .member(member)
                .movieId(request.movieId())
                .score(request.score())
                .comment(request.comment())
                .build();

        return RatingResponse.from(ratingRepository.save(rating));
    }

    @Transactional
    public RatingResponse update(Long memberId, Long ratingId, UpdateRatingRequest request) {
        Rating rating = findOwnedRating(memberId, ratingId);

        rating.update(request.score(), request.comment());
        ratingRepository.save(rating);

        return RatingResponse.from(rating);
    }

    @Transactional
    public void delete(Long memberId, Long ratingId) {
        Rating rating = findOwnedRating(memberId, ratingId);
        ratingRepository.delete(rating);
    }

    /**
     * 평점을 찾고, 그 평점이 요청자의 것인지까지 확인해요.
     * 관문(인터셉터)은 "당신이 누구인지"까지만 확인해줘요.
     * "이 평점이 당신 것인지"는 DB를 봐야 아는 이 기능만의 규칙이라 서비스에서 처리해요.
     * 먼저 찾아보고(없으면 404) 찾았으면 주인을 봐요(내 것이 아니면 403).
     */
    private Rating findOwnedRating(Long memberId, Long ratingId) {
        Rating rating = ratingRepository.findById(ratingId)
                .orElseThrow(() -> new ApiException(HttpStatus.NOT_FOUND, "RATING404_1",
                        "해당 평점을 찾을 수 없습니다."));

        if (!rating.getMember().getMemberId().equals(memberId)) {
            throw new ApiException(HttpStatus.FORBIDDEN, "RATING403_1",
                    "본인이 작성한 평점만 수정하거나 삭제할 수 있습니다.");
        }

        return rating;
    }
}
