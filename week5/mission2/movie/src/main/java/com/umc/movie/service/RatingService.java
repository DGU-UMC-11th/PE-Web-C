package com.umc.movie.service;

import com.umc.movie.dto.RatingPageResponse;
import com.umc.movie.dto.RatingResponse;
import com.umc.movie.entity.Rating;
import com.umc.movie.repository.MemberRepository;
import com.umc.movie.repository.RatingRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.*;
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
    public RatingPageResponse getRatingsByMember(
            Long memberId, int page, int size) {

        if (page < 0 || size < 1 || size > 100) {
            throw new ResponseStatusException(
                    HttpStatus.BAD_REQUEST,
                    "잘못된 페이지 요청입니다."
            );
        }

        if (!memberRepository.existsById(memberId)) {
            throw new ResponseStatusException(
                    HttpStatus.NOT_FOUND,
                    "존재하지 않는 유저입니다."
            );
        }

        Pageable pageable = PageRequest.of(
                page, size, Sort.by("ratingId").descending()
        );

        Page<Rating> ratings =
                ratingRepository.findByMember_MemberId(
                        memberId, pageable
                );

        return new RatingPageResponse(
                ratings.getContent().stream()
                        .map(RatingResponse::from)
                        .toList(),
                ratings.getNumber(),
                ratings.getSize(),
                ratings.getTotalElements(),
                ratings.getTotalPages(),
                ratings.isLast()
        );
    }
}
