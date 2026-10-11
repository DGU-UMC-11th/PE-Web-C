package com.umc.study.exception;

import org.springframework.dao.DataIntegrityViolationException;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.ExceptionHandler;
import org.springframework.web.bind.annotation.RestControllerAdvice;

import java.sql.SQLException;
import java.util.Map;

@RestControllerAdvice
public class BookExceptionHandler {

    @ExceptionHandler(DataIntegrityViolationException.class)
    public ResponseEntity<Map<String, String>> handleIntegrityError(
            DataIntegrityViolationException ex
    ) {

        Throwable cause = ex;

        while (cause != null) {

            if (cause instanceof SQLException sql
                    && sql.getErrorCode() == 1062
                    && sql.getMessage() != null
                    && sql.getMessage().contains("uk_book_title")) {

                return ResponseEntity
                        .status(HttpStatus.CONFLICT)
                        .body(Map.of(
                                "message", "이미 등록된 도서 제목입니다."
                        ));
            }

            cause = cause.getCause();
        }

        return ResponseEntity
                .status(HttpStatus.INTERNAL_SERVER_ERROR)
                .body(Map.of(
                        "message", "데이터베이스 제약조건 위반입니다."
                ));
    }
}