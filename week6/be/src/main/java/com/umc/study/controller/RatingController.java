package com.umc.study.controller;

import com.umc.study.dto.ApiResponse;
import com.umc.study.dto.CreateRatingRequest;
import com.umc.study.dto.RatingResponse;
import com.umc.study.dto.UpdateRatingRequest;
import com.umc.study.service.RatingService;
import jakarta.validation.Valid;
import jakarta.validation.constraints.Min;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.validation.annotation.Validated;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequiredArgsConstructor
@RequestMapping("/members")
@Validated
public class RatingController {

    private final RatingService ratingService;

    // page, size 는 선택이에요. 안 보내면 전체 목록이 나와요.
    @GetMapping("/{memberId}/ratings")
    public List<RatingResponse> getRatings(
            @PathVariable Long memberId,
            @RequestParam(required = false) @Min(value = 0, message = "page는 0 이상이어야 해요.") Integer page,
            @RequestParam(required = false) @Min(value = 1, message = "size는 1 이상이어야 해요.") Integer size) {
        return ratingService.getRatingsByMember(memberId, page, size);
    }

    // 평점 등록 — 201 Created, 만들어진 ratingId를 돌려줘요.
    @PostMapping("/{memberId}/ratings")
    public ResponseEntity<ApiResponse<Long>> create(
            @PathVariable Long memberId,
            @Valid @RequestBody CreateRatingRequest request) {
        Long ratingId = ratingService.create(memberId, request);
        return ResponseEntity.status(HttpStatus.CREATED)
                .body(ApiResponse.created("평점 등록에 성공했습니다.", ratingId));
    }

    // 평점 수정 — 본인 평점만 가능 (아니면 403)
    @PatchMapping("/{memberId}/ratings/{ratingId}")
    public ResponseEntity<ApiResponse<Void>> update(
            @PathVariable Long memberId,
            @PathVariable Long ratingId,
            @Valid @RequestBody UpdateRatingRequest request) {
        ratingService.update(ratingId, memberId, request);
        return ResponseEntity.ok(ApiResponse.ok("평점 수정에 성공했습니다.", null));
    }

    // 평점 삭제 — 204 No Content (본문 없음)
    @DeleteMapping("/{memberId}/ratings/{ratingId}")
    public ResponseEntity<Void> delete(@PathVariable Long memberId, @PathVariable Long ratingId) {
        ratingService.delete(ratingId, memberId);
        return ResponseEntity.noContent().build();
    }
}
