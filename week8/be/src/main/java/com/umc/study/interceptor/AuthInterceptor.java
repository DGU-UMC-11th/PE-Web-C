package com.umc.study.interceptor;

import com.umc.study.exception.ApiException;
import com.umc.study.util.JwtUtil;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpHeaders;
import org.springframework.http.HttpMethod;
import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Component;
import org.springframework.web.servlet.HandlerInterceptor;

/**
 * 컨트롤러에 도달하기 전 모든 요청이 지나가는 관문이에요.
 * 건물 로비의 출입 게이트처럼, 사무실 문마다 경비를 세우는 대신 여기 하나로 거릅니다.
 */
@Component
@RequiredArgsConstructor
public class AuthInterceptor implements HandlerInterceptor {

    public static final String MEMBER_ID = "memberId"; // 컨트롤러에서 꺼낼 때 쓸 이름
    private static final String BEARER_PREFIX = "Bearer ";

    private final JwtUtil jwtUtil;

    @Override
    public boolean preHandle(
            HttpServletRequest request,
            HttpServletResponse response,
            Object handler
    ) {
        // 브라우저가 본 요청 전에 보내는 CORS 사전 요청(preflight)에는 토큰이 붙지 않아요.
        // 여기서 막으면 브라우저에서 오는 모든 요청이 실패하므로 그냥 통과시켜요.
        if (HttpMethod.OPTIONS.matches(request.getMethod())) {
            return true;
        }

        String header = request.getHeader(HttpHeaders.AUTHORIZATION);

        // "Bearer {토큰}" 형식이 아니면 아예 토큰을 보내지 않은 것으로 봐요
        if (header == null || !header.startsWith(BEARER_PREFIX)) {
            throw new ApiException(HttpStatus.UNAUTHORIZED, "AUTH401_2",
                    "로그인이 필요한 요청입니다.");
        }

        // 검증에 실패하면 JwtUtil이 예외를 던지므로, 여기까지 왔다면 유효한 토큰이에요
        Long memberId = jwtUtil.getMemberId(header.substring(BEARER_PREFIX.length()));

        // 뒤이어 실행될 컨트롤러가 꺼내 쓸 수 있도록 요청에 담아둬요
        request.setAttribute(MEMBER_ID, memberId);

        return true;
    }
}
