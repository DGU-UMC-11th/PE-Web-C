package com.umc.study.repository;

import com.umc.study.entity.Book;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.transaction.annotation.Transactional;

import java.util.Comparator;
import java.util.List;

import static org.assertj.core.api.Assertions.assertThat;

@SpringBootTest
@Transactional
class BookRepositoryTest {

    @Autowired
    private BookRepository bookRepository;

    @Test
    void findAllByOrderByBookIdDesc_MySQL에서_책_목록을_최신순으로_가져온다() {
        List<Book> books = bookRepository.findAllByOrderByBookIdDesc();

        // 실제로 DB에서 가져온 데이터를 콘솔에 찍어봅니다. (3주차의 Map 대신 Book 엔티티)
        books.forEach(book -> System.out.println(
                book.getBookId() + " | " + book.getTitle() + " | " + book.getCategory().getName()));

        assertThat(books).isNotEmpty();
        assertThat(books).extracting(Book::getBookId).isSortedAccordingTo(Comparator.reverseOrder());
    }
}
