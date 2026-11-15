package com.umc.movie.interceptor;

import com.umc.movie.exception.ApiException;
import com.umc.movie.util.JwtUtil;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpHeaders;
import org.springframework.http.HttpMethod;
import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Component;
import org.springframework.web.servlet.HandlerInterceptor;

// 컨트롤러에 도달하기 전에 모든 요청이 지나가는 "관문". 로비 출입 게이트처럼 한 곳에서 토큰을 검사해요.
// 하는 일: ① Authorization 헤더에서 토큰 꺼내기 ② 검증하고 memberId 알아내기 ③ 요청에 담아 컨트롤러에 넘기기
@Component
@RequiredArgsConstructor
public class AuthInterceptor implements HandlerInterceptor {

    public static final String MEMBER_ID = "memberId"; // 컨트롤러에서 꺼낼 때 쓸 이름
    private static final String BEARER_PREFIX = "Bearer ";

    private final JwtUtil jwtUtil;

    /** 컨트롤러가 실행되기 "전"에 호출돼요. true를 돌려주면 컨트롤러로 이어지고, 예외를 던지면 여기서 끝나요. */
    @Override
    public boolean preHandle(HttpServletRequest request, HttpServletResponse response, Object handler) {
        // 브라우저가 본 요청 전에 보내는 CORS preflight(OPTIONS)에는 토큰이 붙지 않아요. 막으면 브라우저 요청이 전부 실패하니 통과시켜요.
        if (HttpMethod.OPTIONS.matches(request.getMethod())) {
            return true;
        }

        String header = request.getHeader(HttpHeaders.AUTHORIZATION);

        // "Bearer {토큰}" 형식이 아니면 아예 토큰을 보내지 않은 것으로 봐요
        if (header == null || !header.startsWith(BEARER_PREFIX)) {
            throw new ApiException(HttpStatus.UNAUTHORIZED, "AUTH401_2", "로그인이 필요한 요청입니다.");
        }

        // 검증에 실패하면 JwtUtil이 예외(AUTH401_3 / AUTH401_4)를 던져요. 여기까지 왔다면 유효한 토큰이에요.
        Long memberId = jwtUtil.getMemberId(header.substring(BEARER_PREFIX.length()));

        // 뒤이어 실행될 컨트롤러가 @RequestAttribute로 꺼내 쓸 수 있도록 요청에 담아 둬요
        request.setAttribute(MEMBER_ID, memberId);

        return true;
    }
}
