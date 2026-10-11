package com.umc.study.entity;

import jakarta.persistence.*;
import lombok.AccessLevel;
import lombok.Getter;
import lombok.NoArgsConstructor;

import java.time.LocalDateTime;

@Entity
@Table(name = "rental")
@Getter
@NoArgsConstructor(access = AccessLevel.PROTECTED)
public class Rental {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "rental_id")
    private Long rentalId;

    @Column(name = "user_id", nullable = false)
    private Long userId;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "book_id", nullable = false)
    private Book book;

    @Column(name = "rented_at", nullable = false)
    private LocalDateTime rentedAt;

    @Column(name = "due_at", nullable = false)
    private LocalDateTime dueAt;

    @Column(name = "returned_at")
    private LocalDateTime returnedAt;

    // 도서 대여 객체 생성
    public Rental(Long userId, Book book) {
        this.userId = userId;
        this.book = book;
        this.rentedAt = LocalDateTime.now();
        this.dueAt = this.rentedAt.plusDays(7);
    }

    // 도서 반납 처리
    public void returnBook() {
        this.returnedAt = LocalDateTime.now();
    }
}