package com.umc.study.service;

import com.umc.study.dto.BookResponse;
import com.umc.study.dto.CreateBookRequest;
import com.umc.study.entity.Book;
import com.umc.study.entity.Category;
import com.umc.study.repository.BookRepository;
import com.umc.study.repository.CategoryRepository;

import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.server.ResponseStatusException;

import java.util.List;

@Service
@RequiredArgsConstructor
public class BookService {

    private final BookRepository bookRepository;
    private final CategoryRepository categoryRepository;

    // 1. 전체 도서 최신순 조회
    @Transactional(readOnly = true)
    public List<BookResponse> getAllBooks() {
        return bookRepository.findAllByOrderByBookIdDesc()
                .stream()
                .map(BookResponse::from)
                .toList();
    }

    // 2. 신규 도서 등록
    @Transactional
    public BookResponse createBook(CreateBookRequest request) {

        // 1. 카테고리 존재 여부 확인 (404)
        Category category = categoryRepository
                .findById(request.categoryId())
                .orElseThrow(() -> new ResponseStatusException(
                        HttpStatus.NOT_FOUND,
                        "존재하지 않는 카테고리입니다."
                ));

        // 2. 제목 중복 검사 (409)
        if (bookRepository.existsByTitle(request.title())) {
            throw new ResponseStatusException(
                    HttpStatus.CONFLICT,
                    "이미 등록된 도서 제목입니다."
            );
        }

        // 3. 도서 등록
        Book book = new Book(
                category,
                request.title(),
                request.description()
        );

        Book savedBook = bookRepository.save(book);

        return BookResponse.from(savedBook);
    }

    // 3. 특정 카테고리 도서 조회 (기존 기능 유지)
    @Transactional(readOnly = true)
    public List<BookResponse> getBooksByCategory(Long categoryId) {
        return bookRepository
                .findByCategory_CategoryIdOrderByBookIdDesc(categoryId)
                .stream()
                .map(BookResponse::from)
                .toList();
    }
}