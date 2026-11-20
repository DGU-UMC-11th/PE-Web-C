package com.umc.study.service;

import com.umc.study.domain.Favorite;
import com.umc.study.domain.Member;
import com.umc.study.dto.CreateFavoriteRequest;
import com.umc.study.dto.FavoriteResponse;
import com.umc.study.dto.FavoriteStatusResponse;
import com.umc.study.exception.ApiException;
import com.umc.study.repository.FavoriteRepository;
import com.umc.study.repository.MemberRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;

@Service
@RequiredArgsConstructor
@Transactional(readOnly = true)
public class FavoriteService {

    private final FavoriteRepository favoriteRepository;
    private final MemberRepository memberRepository;

    @Transactional
    public FavoriteResponse create(Long memberId, CreateFavoriteRequest request) {
        Member member = memberRepository.findById(memberId)
                .orElseThrow(() -> new ApiException(HttpStatus.NOT_FOUND, "MEMBER404_1",
                        "해당 회원을 찾을 수 없습니다."));

        // 사전 검사는 친절한 오류 메시지를 위한 것이고,
        // DB의 복합 UNIQUE 제약은 동시 요청까지 포함해 데이터를 지키는 마지막 안전망이에요.
        if (favoriteRepository.existsByMember_MemberIdAndMovieId(memberId, request.movieId())) {
            throw new ApiException(HttpStatus.CONFLICT, "FAVORITE409_1",
                    "이미 이 영화를 즐겨찾기하셨습니다.");
        }

        Favorite favorite = Favorite.builder()
                .member(member)
                .movieId(request.movieId())
                .build();

        return FavoriteResponse.from(favoriteRepository.save(favorite));
    }

    // 빈 목록은 오류가 아니라 "아직 보관한 영화가 없다"는 정상 상태예요.
    public List<FavoriteResponse> getMyFavorites(Long memberId) {
        return favoriteRepository.findByMember_MemberIdOrderByFavoriteIdDesc(memberId).stream()
                .map(FavoriteResponse::from)
                .toList();
    }

    public FavoriteStatusResponse getStatus(Long memberId, Long movieId) {
        return new FavoriteStatusResponse(
                favoriteRepository.existsByMember_MemberIdAndMovieId(memberId, movieId));
    }

    @Transactional
    public void delete(Long memberId, Long movieId) {
        Favorite favorite = favoriteRepository.findByMember_MemberIdAndMovieId(memberId, movieId)
                .orElseThrow(() -> new ApiException(HttpStatus.NOT_FOUND, "FAVORITE404_1",
                        "즐겨찾기한 영화를 찾을 수 없습니다."));

        favoriteRepository.delete(favorite);
    }
}
