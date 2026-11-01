package com.umc.study.exception;

import com.fasterxml.jackson.annotation.JsonInclude;

import java.util.Map;

// 오류 응답 모양. errors는 검증 실패일 때만 "필드명: 메시지"로 담아요.
@JsonInclude(JsonInclude.Include.NON_NULL)
public record ApiErrorResponse(
        int status,
        String code,
        String message,
        Map<String, String> errors
) {
    public static ApiErrorResponse of(int status, String code, String message) {
        return new ApiErrorResponse(status, code, message, null);
    }
}
