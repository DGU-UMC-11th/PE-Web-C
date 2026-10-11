package com.umc.study.repository;

import com.umc.study.entity.Book;
import org.springframework.data.jpa.repository.EntityGraph;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

// 3주차: JdbcTemplate + SQL 문자열을 직접 작성
// 4주차: JpaRepository를 상속하면 save, findById, findAll 같은 기본 CRUD가 생기고,
//        메서드 이름 규칙(findAllBy...OrderBy...)으로 조회 SQL을 Spring Data JPA가 만들어 줘요.
public interface BookRepository extends JpaRepository<Book, Long> {

    // 최신 등록순 = book_id 내림차순
    // @EntityGraph: 책 목록과 카테고리를 JOIN 한 번으로 함께 가져와 N+1 쿼리를 막아요.
    @EntityGraph(attributePaths = "category")
    List<Book> findAllByOrderByBookIdDesc();

    // 3주차의 GET /books/category/{categoryId}도 ORM으로 옮겼어요.
    // Category_CategoryId: book.category.categoryId 경로로 조건을 걸어요.
    @EntityGraph(attributePaths = "category")
    List<Book> findAllByCategory_CategoryIdOrderByBookIdDesc(Long categoryId);
}
