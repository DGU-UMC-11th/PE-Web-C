package com.umc.study.repository;

import com.umc.study.entity.Book;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface BookRepository extends JpaRepository<Book, Long> {

    // 전체 도서 최신순 조회
    List<Book> findAllByOrderByBookIdDesc();

    // 특정 카테고리 도서 조회
    List<Book> findByCategory_CategoryIdOrderByBookIdDesc(Long categoryId);

    // 제목 중복 여부 확인
    boolean existsByTitle(String title);
}