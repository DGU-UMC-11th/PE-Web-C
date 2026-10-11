package com.umc.study.repository;

import com.umc.study.entity.Book;
import jakarta.persistence.LockModeType;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Lock;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import java.util.List;
import java.util.Optional;

public interface BookRepository extends JpaRepository<Book, Long> {

    // 전체 도서 최신순 조회
    List<Book> findAllByOrderByBookIdDesc();

    // 특정 카테고리 도서 조회
    List<Book> findByCategory_CategoryIdOrderByBookIdDesc(Long categoryId);

    // 제목 중복 검사
    boolean existsByTitle(String title);

    // 대여 시 도서 행 잠금
    @Lock(LockModeType.PESSIMISTIC_WRITE)
    @Query("SELECT b FROM Book b WHERE b.bookId = :bookId")
    Optional<Book> findByIdForUpdate(@Param("bookId") Long bookId);
}