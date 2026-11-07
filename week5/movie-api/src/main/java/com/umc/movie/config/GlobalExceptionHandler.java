package com.umc.movie.config;

import com.umc.movie.dto.ErrorResponse;
import jakarta.validation.ConstraintViolation;
import jakarta.validation.ConstraintViolationException;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.ExceptionHandler;
import org.springframework.web.bind.annotation.RestControllerAdvice;

import java.util.stream.Collectors;

/**
 * 선택 미션용 최소 예외 처리예요.
 * @Validated가 path variable / query param 검증에 실패하면 ConstraintViolationException이 나는데,
 * 그대로 두면 500으로 나가기 때문에 400으로 바꿔 줘요.
 * 전체 예외 처리 체계는 6주차에 제대로 다뤄요.
 */
@RestControllerAdvice
public class GlobalExceptionHandler {

    @ExceptionHandler(ConstraintViolationException.class)
    public ResponseEntity<ErrorResponse> handleConstraintViolation(ConstraintViolationException exception) {
        String message = exception.getConstraintViolations().stream()
                .map(ConstraintViolation::getMessage)
                .collect(Collectors.joining(" "));

        return ResponseEntity.badRequest().body(new ErrorResponse(message));
    }
}
