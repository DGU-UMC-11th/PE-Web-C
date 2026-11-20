package com.umc.study.repository;

import com.umc.study.domain.Book;
import org.springframework.data.jpa.repository.EntityGraph;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface BookRepository extends JpaRepository<Book, Long> {

    // 최신 등록순 조회 + category를 한 번에 JOIN해서 가져옴 (N+1 방지)
    @EntityGraph(attributePaths = "category")
    List<Book> findAllByOrderByBookIdDesc();
}