package com.umc.movie.controller;

import com.umc.movie.dto.ApiResponse;
import com.umc.movie.dto.CreateMovieRecordRequest;
import com.umc.movie.dto.MovieRecordResponse;
import com.umc.movie.interceptor.AuthInterceptor;
import com.umc.movie.service.MovieRecordService;

import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.security.SecurityRequirement;
import io.swagger.v3.oas.annotations.responses.ApiResponses;
import io.swagger.v3.oas.annotations.tags.Tag;

import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;

import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestAttribute;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequiredArgsConstructor
@Tag(
        name = "영화 기록",
        description = "평점과 즐겨찾기를 함께 저장하는 API"
)
public class MovieRecordController {

    private final MovieRecordService movieRecordService;

    // 영화 기록 저장
    @Operation(
            summary = "영화 기록 저장",
            description = """
            평점을 저장하고 addToFavorites가 true이면
            즐겨찾기도 함께 저장합니다.

            두 작업은 하나의 트랜잭션으로 처리됩니다.

            요청 예시:
            {
              "movieId": 238,
              "score": 5,
              "comment": "다시 보고 싶은 영화입니다.",
              "addToFavorites": true
            }
            """,
            security = @SecurityRequirement(name = "bearerAuth")
    )
    @ApiResponses({
            @io.swagger.v3.oas.annotations.responses.ApiResponse(
                    responseCode = "201",
                    description = "COMMON201 - 영화 기록 저장 성공"
            ),
            @io.swagger.v3.oas.annotations.responses.ApiResponse(
                    responseCode = "400",
                    description = "입력값 검증 실패"
            ),
            @io.swagger.v3.oas.annotations.responses.ApiResponse(
                    responseCode = "401",
                    description = "인증 필요"
            ),
            @io.swagger.v3.oas.annotations.responses.ApiResponse(
                    responseCode = "409",
                    description = "RATING409_1 또는 FAVORITE409_1 - 중복 등록"
            )
    })
    @PostMapping("/movie-records")
    public ResponseEntity<ApiResponse<MovieRecordResponse>> create(
            @RequestAttribute(AuthInterceptor.MEMBER_ID) Long memberId,
            @RequestBody @Valid CreateMovieRecordRequest request
    ) {
        MovieRecordResponse response =
                movieRecordService.create(memberId, request);

        return ResponseEntity.status(201)
                .body(
                        ApiResponse.created(
                                "영화 기록을 저장했습니다.",
                                response
                        )
                );
    }
}
