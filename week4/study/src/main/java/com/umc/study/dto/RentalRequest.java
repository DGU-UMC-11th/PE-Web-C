package com.umc.study.dto;

// POST /rentals 요청 Body: { "userId": 1, "bookId": 3 }
public record RentalRequest(Long userId, Long bookId) {
}
