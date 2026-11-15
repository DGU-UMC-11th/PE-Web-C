package com.umc.movie.exception;

import com.umc.movie.dto.ApiResponse;
import org.springframework.dao.DataIntegrityViolationException;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.http.converter.HttpMessageNotReadableException;
import org.springframework.web.bind.MethodArgumentNotValidException;
import org.springframework.web.bind.annotation.ExceptionHandler;
import org.springframework.web.bind.annotation.RestControllerAdvice;
import org.springframework.web.method.annotation.MethodArgumentTypeMismatchException;
import org.springframework.web.server.ResponseStatusException;

// 어느 Controller에서 예외가 나도 여기서 잡아 같은 모양(ApiResponse)으로 바꿔요.
@RestControllerAdvice
public class GlobalExceptionHandler {

    // @Valid 검증 실패 → 400. 첫 번째 필드 오류 메시지를 그대로 내려 줘요.
    @ExceptionHandler(MethodArgumentNotValidException.class)
    public ResponseEntity<ApiResponse<Void>> handleValidation(MethodArgumentNotValidException exception) {
        String message = exception.getBindingResult().getFieldErrors().get(0).getDefaultMessage();
        return ResponseEntity.badRequest().body(ApiResponse.failure("COMMON4001", message));
    }

    // JSON 본문이 비어 있거나 깨졌을 때 → 400
    @ExceptionHandler(HttpMessageNotReadableException.class)
    public ResponseEntity<ApiResponse<Void>> handleUnreadable(HttpMessageNotReadableException exception) {
        return ResponseEntity.badRequest().body(ApiResponse.failure("COMMON4002", "요청 본문을 읽을 수 없습니다."));
    }

    // /members/abc/ratings 처럼 경로 변수 타입이 안 맞을 때 → 400
    @ExceptionHandler(MethodArgumentTypeMismatchException.class)
    public ResponseEntity<ApiResponse<Void>> handleTypeMismatch(MethodArgumentTypeMismatchException exception) {
        return ResponseEntity.badRequest().body(ApiResponse.failure("COMMON4003", "요청 값의 형식이 올바르지 않습니다."));
    }

    // 서비스에서 던진 우리 예외 → 예외가 들고 있는 status/code 그대로
    @ExceptionHandler(ApiException.class)
    public ResponseEntity<ApiResponse<Void>> handleApi(ApiException exception) {
        return ResponseEntity.status(exception.getStatus())
                .body(ApiResponse.failure(exception.getCode(), exception.getMessage()));
    }

    // 사전 중복 체크를 통과했는데 DB UNIQUE 제약에서 막힌 경우(동시 요청) → 409. 마지막 안전망이에요.
    @ExceptionHandler(DataIntegrityViolationException.class)
    public ResponseEntity<ApiResponse<Void>> handleDataIntegrity(DataIntegrityViolationException exception) {
        return ResponseEntity.status(HttpStatus.CONFLICT)
                .body(ApiResponse.failure("COMMON4091", "이미 존재하는 데이터입니다."));
    }

    // 5주차에 쓰던 ResponseStatusException(404 등)도 같은 모양으로
    @ExceptionHandler(ResponseStatusException.class)
    public ResponseEntity<ApiResponse<Void>> handleResponseStatus(ResponseStatusException exception) {
        int status = exception.getStatusCode().value();
        return ResponseEntity.status(status)
                .body(ApiResponse.failure("COMMON" + status, exception.getReason()));
    }
}
