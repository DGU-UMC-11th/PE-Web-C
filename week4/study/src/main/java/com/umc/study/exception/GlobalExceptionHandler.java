package com.umc.study.exception;

import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.http.converter.HttpMessageNotReadableException;
import org.springframework.validation.FieldError;
import org.springframework.web.bind.MethodArgumentNotValidException;
import org.springframework.web.bind.annotation.ExceptionHandler;
import org.springframework.web.bind.annotation.RestControllerAdvice;

import java.util.LinkedHashMap;
import java.util.Map;

// 컨트롤러에서 던져진 예외를 한곳에서 잡아 일정한 JSON 오류 응답으로 바꿔요.
// (처리하지 않으면 IllegalArgumentException 같은 예외는 500 Internal Server Error가 돼요.)
@RestControllerAdvice
public class GlobalExceptionHandler {

    // 없는 categoryId → 404
    @ExceptionHandler(CategoryNotFoundException.class)
    public ResponseEntity<ApiErrorResponse> handleCategoryNotFound(CategoryNotFoundException e) {
        return ResponseEntity.status(HttpStatus.NOT_FOUND)
                .body(ApiErrorResponse.of(404, "CATEGORY_NOT_FOUND", e.getMessage()));
    }

    // @Valid 검증 실패 (빈 제목, 100자 초과, categoryId 누락) → 400
    @ExceptionHandler(MethodArgumentNotValidException.class)
    public ResponseEntity<ApiErrorResponse> handleValidation(MethodArgumentNotValidException e) {
        Map<String, String> errors = new LinkedHashMap<>();
        for (FieldError fieldError : e.getBindingResult().getFieldErrors()) {
            errors.putIfAbsent(fieldError.getField(), fieldError.getDefaultMessage());
        }
        return ResponseEntity.badRequest()
                .body(new ApiErrorResponse(400, "INVALID_REQUEST", "요청 값이 올바르지 않습니다.", errors));
    }

    // JSON 형식이 깨졌거나 categoryId에 숫자가 아닌 값이 들어온 경우 → 400
    @ExceptionHandler(HttpMessageNotReadableException.class)
    public ResponseEntity<ApiErrorResponse> handleNotReadable(HttpMessageNotReadableException e) {
        return ResponseEntity.badRequest()
                .body(ApiErrorResponse.of(400, "INVALID_JSON", "요청 Body를 읽을 수 없습니다. JSON 형식과 값의 타입을 확인해 주세요."));
    }
}
