package com.umc.study.config;

import org.springframework.context.annotation.Configuration;
import org.springframework.web.servlet.config.annotation.CorsRegistry;
import org.springframework.web.servlet.config.annotation.WebMvcConfigurer;

// 실습 0: 이 클래스의 @Configuration 을 주석 처리하고 재시작하면 브라우저에서 CORS 에러가 나요.
@Configuration
public class WebConfig implements WebMvcConfigurer {

    // "*" 로 열면 어떤 사이트에서든 우리 API를 부를 수 있어요. 쓰는 출처만 적어둬요.
    private static final String[] ALLOWED_ORIGINS = {
            "http://localhost:5173",
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
