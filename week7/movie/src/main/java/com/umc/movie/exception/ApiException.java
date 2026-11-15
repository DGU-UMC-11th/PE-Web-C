package com.umc.movie.exception;

import lombok.Getter;
import org.springframework.http.HttpStatus;

// 상태 코드 + 우리 서비스의 오류 code + 메시지를 함께 들고 다니는 예외.
// 선택 미션: 이메일/닉네임 중복처럼 같은 409라도 code를 다르게 내려 주기 위해 만들었어요.
@Getter
public class ApiException extends RuntimeException {

    private final HttpStatus status;
    private final String code;

    public ApiException(HttpStatus status, String code, String message) {
        super(message);
        this.status = status;
        this.code = code;
    }
}
