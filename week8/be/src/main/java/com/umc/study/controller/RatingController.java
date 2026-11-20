package com.umc.study.controller;

import com.umc.study.annotation.LoginMember;
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

// 클래스 레벨 @RequestMapping("/members")를 뺐어요.
// 평점 API가 이제 /ratings 로 나가기 때문이에요.
@RestController
@RequiredArgsConstructor
@Validated
public class RatingController {

    private final RatingService ratingService;

    // 5주차에 만든 유저별 평점 조회예요. 공개 API라 토큰을 받지 않아요.
    // 클래스 매핑이 없어진 만큼 전체 경로를 적어줘요.
    @GetMapping("/members/{memberId}/ratings")
    public List<RatingResponse> getMemberRatings(
            @PathVariable Long memberId,
            @RequestParam(required = false) @Min(value = 0, message = "page는 0 이상이어야 해요.") Integer page,
            @RequestParam(required = false) @Min(value = 1, message = "size는 1 이상이어야 해요.") Integer size) {
        return ratingService.getRatingsByMember(memberId, page, size);
    }

    // 경로에서 /members/{memberId}가 통째로 사라졌어요.
    // 값을 받지 않는 것이 곧 그 값을 조작당하지 않는 방법이에요.
    @PostMapping("/ratings")
    public ResponseEntity<ApiResponse<RatingResponse>> create(
            @LoginMember Long memberId,
            @RequestBody @Valid CreateRatingRequest request
    ) {
        RatingResponse response = ratingService.create(memberId, request);
        return ResponseEntity.status(HttpStatus.CREATED)
                .body(ApiResponse.created("평점을 등록했습니다.", response));
    }

    @PatchMapping("/ratings/{ratingId}")
    public ResponseEntity<ApiResponse<RatingResponse>> update(
            @LoginMember Long memberId,
            @PathVariable Long ratingId,
            @RequestBody @Valid UpdateRatingRequest request
    ) {
        RatingResponse response = ratingService.update(memberId, ratingId, request);
        return ResponseEntity.ok(ApiResponse.ok("평점을 수정했습니다.", response));
    }

    // 204는 "본문 없음"이라 공통 응답 형식을 실을 수 없어서 200으로 맞추고 result를 null로 둬요.
    @DeleteMapping("/ratings/{ratingId}")
    public ResponseEntity<ApiResponse<Void>> delete(
            @LoginMember Long memberId,
            @PathVariable Long ratingId
    ) {
        ratingService.delete(memberId, ratingId);
        return ResponseEntity.ok(ApiResponse.ok("평점을 삭제했습니다.", null));
    }
}
