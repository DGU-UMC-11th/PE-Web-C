package com.umc.movie.config;

import org.springframework.context.annotation.Configuration;
import org.springframework.web.servlet.config.annotation.CorsRegistry;
import org.springframework.web.servlet.config.annotation.WebMvcConfigurer;

/**
 * CORS 허용 여부는 서버가 응답 헤더에 무엇을 담는지로만 결정돼요.
 * 컨트롤러마다 @CrossOrigin을 붙일 수도 있지만,
 * 서비스 전체에 같은 정책을 적용할 때는 한 곳에서 설정하는 쪽이 관리하기 편해요.
 */
@Configuration
public class WebConfig implements WebMvcConfigurer {

    // 선택 미션: "*" 대신 프론트 개발 서버 출처만 허용해요.
    private static final String[] ALLOWED_ORIGINS = {
            "http://localhost:5173", // Vite 개발 서버
            "http://127.0.0.1:5173"
    };

    @Override
    public void addCorsMappings(CorsRegistry registry) {
        registry.addMapping("/**")
                .allowedOrigins(ALLOWED_ORIGINS)
                .allowedMethods("GET", "POST", "PATCH", "DELETE")
                .allowedHeaders("*");
    }
}
