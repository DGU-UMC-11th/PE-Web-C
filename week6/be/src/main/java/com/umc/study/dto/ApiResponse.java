package com.umc.study.dto;

// 성공이든 실패든 화면이 같은 모양으로 읽을 수 있도록 응답을 하나로 통일해요.
public record ApiResponse<T>(boolean isSuccess, String code, String message, T result) {

    public static <T> ApiResponse<T> ok(String message, T result) {
        return new ApiResponse<>(true, "COMMON200", message, result);
    }

    public static <T> ApiResponse<T> created(String message, T result) {
        return new ApiResponse<>(true, "COMMON201", message, result);
    }

    public static ApiResponse<Void> failure(String code, String message) {
        return new ApiResponse<>(false, code, message, null);
    }
}
