package com.umc.movie.controller;

import com.umc.movie.dto.ApiResponse;
import com.umc.movie.dto.LoginRequest;
import com.umc.movie.dto.LoginResponse;
import com.umc.movie.service.AuthService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

// /auth/login은 "명사형 자원 경로" 원칙의 예외예요. 원칙대로면 POST /auth/tokens가 맞지만,
// 워낙 많은 서비스가 /login을 써서 프론트가 한눈에 알아보는 장점이 더 커요. (예외라는 걸 알고 쓰는 것)
@RestController
@RequestMapping("/auth")
@RequiredArgsConstructor
public class AuthController {

    private final AuthService authService;

    @PostMapping("/login")
    public ResponseEntity<ApiResponse<LoginResponse>> login(@RequestBody @Valid LoginRequest request) {
        LoginResponse response = authService.login(request);
        return ResponseEntity.ok(ApiResponse.ok("로그인에 성공했습니다.", response));
    }
}
