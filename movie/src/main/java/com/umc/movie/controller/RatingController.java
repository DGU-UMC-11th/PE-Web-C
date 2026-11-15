// src/main/java/com/umc/movie/controller/RatingController.java
package com.umc.movie.controller;

import com.umc.movie.dto.ApiResponse;
import com.umc.movie.dto.CreateRatingRequest;
import com.umc.movie.dto.RatingResponse;
import com.umc.movie.dto.UpdateRatingRequest;
import com.umc.movie.interceptor.AuthInterceptor;
import com.umc.movie.service.RatingService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequiredArgsConstructor
public class RatingController {

    private final RatingService ratingService;

    // 기존 회원별 평점 조회 (공개 API, 페이지네이션 유지)
    @GetMapping("/members/{memberId}/ratings")
    public Page<RatingResponse> getMemberRatings(
            @PathVariable Long memberId,
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "10") int size
    ) {
        return ratingService.getRatingsByMember(
                memberId,
                page,
                size
        );
    }

    // JWT로 인증된 회원의 평점 등록
    @PostMapping("/ratings")
    public ResponseEntity<ApiResponse<RatingResponse>> createRating(
            @RequestAttribute(AuthInterceptor.MEMBER_ID) Long memberId,
            @Valid @RequestBody CreateRatingRequest request
    ) {
        RatingResponse response = ratingService.createRating(
                memberId,
                request
        );

        return ResponseEntity.status(HttpStatus.CREATED)
                .body(ApiResponse.created(
                        "평점 등록에 성공했습니다.",
                        response
                ));
    }

    // 본인이 작성한 평점 수정
    @PatchMapping("/ratings/{ratingId}")
    public ResponseEntity<ApiResponse<RatingResponse>> updateRating(
            @RequestAttribute(AuthInterceptor.MEMBER_ID) Long memberId,
            @PathVariable Long ratingId,
            @Valid @RequestBody UpdateRatingRequest request
    ) {
        RatingResponse response = ratingService.updateRating(
                memberId,
                ratingId,
                request
        );

        return ResponseEntity.ok(
                ApiResponse.ok(
                        "평점 수정에 성공했습니다.",
                        response
                )
        );
    }

    // 본인이 작성한 평점 삭제
    @DeleteMapping("/ratings/{ratingId}")
    public ResponseEntity<ApiResponse<Void>> deleteRating(
            @RequestAttribute(AuthInterceptor.MEMBER_ID) Long memberId,
            @PathVariable Long ratingId
    ) {
        ratingService.deleteRating(memberId, ratingId);

        return ResponseEntity.ok(
                ApiResponse.ok("평점을 삭제했습니다.", null)
        );
    }
}
