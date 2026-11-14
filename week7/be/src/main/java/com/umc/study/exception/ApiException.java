package com.umc.study.exception;

import lombok.Getter;
import org.springframework.http.HttpStatus;

/**
 * 상태 코드와 code 문자열을 함께 들고 다니는 예외예요.
 * 서비스나 인터셉터 같은 안쪽에서 던져도 GlobalExceptionHandler가 우리 응답 형식으로 바꿔줘요.
 */
@Getter
public class ApiException extends RuntimeException {

    private final HttpStatus status; // 응답으로 내보낼 HTTP 상태 코드
    private final String code;       // 응답 바디의 code 필드에 실릴 문자열

    public ApiException(HttpStatus status, String code, String message) {
        super(message);
        this.status = status;
        this.code = code;
    }
}
