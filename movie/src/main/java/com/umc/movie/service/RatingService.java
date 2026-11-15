
package com.umc.movie.service;

import com.umc.movie.dto.CreateRatingRequest;
import com.umc.movie.dto.RatingResponse;
import com.umc.movie.dto.UpdateRatingRequest;
import com.umc.movie.entity.Member;
import com.umc.movie.entity.Rating;
import com.umc.movie.repository.MemberRepository;
import com.umc.movie.repository.RatingRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.server.ResponseStatusException;

@Service
@RequiredArgsConstructor
public class RatingService {

    private final RatingRepository ratingRepository;
    private final MemberRepository memberRepository;

    @Transactional(readOnly = true)
    public Page<RatingResponse> getRatingsByMember(
            Long memberId,
            int page,
            int size
    ) {
        if (!memberRepository.existsById(memberId)) {
            throw new ResponseStatusException(
                    HttpStatus.NOT_FOUND,
                    "존재하지 않는 유저입니다."
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

    @Transactional
    public RatingResponse createRating(
            Long memberId,
            CreateRatingRequest request
    ) {
        Member member = memberRepository.findById(memberId)
                .orElseThrow(() -> new ResponseStatusException(
                        HttpStatus.NOT_FOUND,
                        "존재하지 않는 유저입니다."
                ));

        if (ratingRepository.existsByMember_MemberIdAndMovieId(
                memberId,
                request.movieId()
        )) {
            throw new ResponseStatusException(
                    HttpStatus.CONFLICT,
                    "이미 평가한 영화입니다."
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

    @Transactional
    public RatingResponse updateRating(
            Long memberId,
            Long ratingId,
            UpdateRatingRequest request
    ) {
        Rating rating = ratingRepository.findById(ratingId)
                .orElseThrow(() -> new ResponseStatusException(
                        HttpStatus.NOT_FOUND,
                        "존재하지 않는 평점입니다."
                ));

        if (!rating.getMember().getMemberId().equals(memberId)) {
            throw new ResponseStatusException(
                    HttpStatus.FORBIDDEN,
                    "다른 회원의 평점은 수정할 수 없습니다."
            );
        }

        rating.update(request.score(), request.comment());

        return RatingResponse.from(rating);
    }

    @Transactional
    public void deleteRating(Long memberId, Long ratingId) {
        Rating rating = ratingRepository.findById(ratingId)
                .orElseThrow(() -> new ResponseStatusException(
                        HttpStatus.NOT_FOUND,
                        "존재하지 않는 평점입니다."
                ));

        if (!rating.getMember().getMemberId().equals(memberId)) {
            throw new ResponseStatusException(
                    HttpStatus.FORBIDDEN,
                    "다른 회원의 평점은 삭제할 수 없습니다."
            );
        }

        ratingRepository.delete(rating);
    }
}
