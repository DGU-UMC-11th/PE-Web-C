package com.umc.movie.controller;

import com.umc.movie.dto.RatingResponse;
import com.umc.movie.service.RatingService;
import jakarta.validation.constraints.Min;
import lombok.RequiredArgsConstructor;
import org.springframework.validation.annotation.Validated;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import java.util.List;

/**
 * MemberController와 같은 /members 경로를 나눠 써요.
 * 파일은 다루는 자원(Member vs Rating) 기준으로 나누고,
 * URL은 프론트가 이해하기 쉬운 모양(/members/...)으로 맞췄어요.
 */
@RestController
@RequiredArgsConstructor
@RequestMapping("/members")
@Validated
public class RatingController {

    private final RatingService ratingService;

    @GetMapping("/{memberId}/ratings")
    public List<RatingResponse> getMemberRatings(
            @PathVariable Long memberId,
            @RequestParam(required = false) @Min(value = 0, message = "page는 0 이상이어야 합니다.") Integer page,
            @RequestParam(required = false) @Min(value = 1, message = "size는 1 이상이어야 합니다.") Integer size) {
        return ratingService.getRatingsByMember(memberId, page, size);
    }
}
