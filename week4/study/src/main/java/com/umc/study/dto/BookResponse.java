package com.umc.study.dto;

import com.umc.study.entity.Book;

// API 응답 모양. DB 컬럼(book_id, category_id ...) 대신 클라이언트와 약속한 필드만 내보내요.
public record BookResponse(
        Long bookId,
        String title,
        String description,
        String categoryName,
        Boolean isAvailable
) {
    public static BookResponse from(Book book) {
        return new BookResponse(
                book.getBookId(),
                book.getTitle(),
                book.getDescription(),
                book.getCategory().getName(),
                book.getIsAvailable()
        );
    }
}
