package com.umc.movie.service;

import com.umc.movie.dto.RatingResponse;
import com.umc.movie.entity.Rating;
import com.umc.movie.repository.MemberRepository;
import com.umc.movie.repository.RatingRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.PageRequest;
import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.server.ResponseStatusException;

import java.util.List;

@Service
@RequiredArgsConstructor
public class RatingService {

    private final RatingRepository ratingRepository;
    private final MemberRepository memberRepository;

    @Transactional(readOnly = true)
    public List<RatingResponse> getRatingsByMember(Long memberId, Integer page, Integer size) {
        if (!memberRepository.existsById(memberId)) {
            // 예외를 한 곳에서 다루는 @RestControllerAdvice는 6주차에 배워요.
            // 지금은 Spring이 기본 제공하는 ResponseStatusException으로 404를 바로 응답해요.
            throw new ResponseStatusException(HttpStatus.NOT_FOUND, "존재하지 않는 유저입니다.");
        }

        // 선택 미션: page/size가 둘 다 들어오면 페이지 단위로 잘라서 응답해요.
        List<Rating> ratings = (page == null || size == null)
                ? ratingRepository.findByMember_MemberIdOrderByRatingIdDesc(memberId)
                : ratingRepository.findByMember_MemberIdOrderByRatingIdDesc(
                        memberId, PageRequest.of(page, size));

        return ratings.stream()
                .map(RatingResponse::from)
                .toList();
    }
}
