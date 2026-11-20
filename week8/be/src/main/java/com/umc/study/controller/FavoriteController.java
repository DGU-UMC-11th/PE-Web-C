package com.umc.study.controller;

import com.umc.study.annotation.LoginMember;
import com.umc.study.dto.ApiResponse;
import com.umc.study.dto.CreateFavoriteRequest;
import com.umc.study.dto.FavoriteResponse;
import com.umc.study.dto.FavoriteStatusResponse;
import com.umc.study.service.FavoriteService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

// 요청 어디에도 memberId가 없어요. 토큰이 알려줍니다.
@RestController
@RequiredArgsConstructor
@RequestMapping("/favorites")
public class FavoriteController {

    private final FavoriteService favoriteService;

    @PostMapping
    public ResponseEntity<ApiResponse<FavoriteResponse>> create(
            @LoginMember Long memberId,
            @RequestBody @Valid CreateFavoriteRequest request
    ) {
        FavoriteResponse response = favoriteService.create(memberId, request);
        return ResponseEntity.status(HttpStatus.CREATED)
                .body(ApiResponse.created("즐겨찾기를 등록했습니다.", response));
    }

    @GetMapping
    public ResponseEntity<ApiResponse<List<FavoriteResponse>>> getMyFavorites(@LoginMember Long memberId) {
        return ResponseEntity.ok(
                ApiResponse.ok("내 즐겨찾기 목록을 조회했습니다.", favoriteService.getMyFavorites(memberId)));
    }

    @GetMapping("/{movieId}")
    public ResponseEntity<ApiResponse<FavoriteStatusResponse>> getStatus(
            @LoginMember Long memberId,
            @PathVariable Long movieId
    ) {
        return ResponseEntity.ok(
                ApiResponse.ok("즐겨찾기 여부를 조회했습니다.", favoriteService.getStatus(memberId, movieId)));
    }

    // 삭제도 공통 응답 형식을 유지하려고 204 대신 200 + result: null 을 써요.
    @DeleteMapping("/{movieId}")
    public ResponseEntity<ApiResponse<Void>> delete(
            @LoginMember Long memberId,
            @PathVariable Long movieId
    ) {
        favoriteService.delete(memberId, movieId);
        return ResponseEntity.ok(ApiResponse.ok("즐겨찾기를 해제했습니다.", null));
    }
}
