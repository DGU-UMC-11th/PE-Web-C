package com.umc.study.service;

import com.umc.study.domain.Favorite;
import com.umc.study.domain.Member;
import com.umc.study.domain.Rating;
import com.umc.study.dto.CreateMovieRecordRequest;
import com.umc.study.dto.FavoriteResponse;
import com.umc.study.dto.MovieRecordResponse;
import com.umc.study.dto.RatingResponse;
import com.umc.study.exception.ApiException;
import com.umc.study.repository.FavoriteRepository;
import com.umc.study.repository.MemberRepository;
import com.umc.study.repository.RatingRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

/**
 * 평점과 즐겨찾기를 한 요청에서 함께 저장해요.
 *
 * RatingService.create()와 FavoriteService.create()를 연달아 부르면
 * 각각 별도의 트랜잭션으로 동작할 수 있어서, 둘 중 하나만 저장되는 상태가 남을 수 있어요.
 * 그래서 "영화 기록"이라는 하나의 사용자 행동을 처리하는 전용 서비스에서
 * 두 저장을 하나의 트랜잭션으로 묶었어요.
 */
@Service
@RequiredArgsConstructor
public class MovieRecordService {

    private final MemberRepository memberRepository;
    private final RatingRepository ratingRepository;
    private final FavoriteRepository favoriteRepository;

    // 메서드가 정상적으로 끝나면 commit, 런타임 예외가 밖으로 나가면 rollback 돼요.
    @Transactional
    public MovieRecordResponse create(Long memberId, CreateMovieRecordRequest request) {
        Member member = memberRepository.findById(memberId)
                .orElseThrow(() -> new ApiException(HttpStatus.NOT_FOUND, "MEMBER404_1",
                        "해당 회원을 찾을 수 없습니다."));

        if (ratingRepository.existsByMember_MemberIdAndMovieId(memberId, request.movieId())) {
            throw new ApiException(HttpStatus.CONFLICT, "RATING409_1",
                    "이미 이 영화에 평점을 남기셨습니다.");
        }

        if (request.addToFavorites()
                && favoriteRepository.existsByMember_MemberIdAndMovieId(memberId, request.movieId())) {
            throw new ApiException(HttpStatus.CONFLICT, "FAVORITE409_1",
                    "이미 이 영화를 즐겨찾기하셨습니다.");
        }

        Rating savedRating = ratingRepository.save(Rating.builder()
                .member(member)
                .movieId(request.movieId())
                .score(request.score())
                .comment(request.comment())
                .build());

        FavoriteResponse favoriteResponse = null;
        if (request.addToFavorites()) {
            Favorite savedFavorite = favoriteRepository.save(Favorite.builder()
                    .member(member)
                    .movieId(request.movieId())
                    .build());
            favoriteResponse = FavoriteResponse.from(savedFavorite);
        }

        return new MovieRecordResponse(RatingResponse.from(savedRating), favoriteResponse);
    }
}
