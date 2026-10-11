package com.umc.study.service;

import com.umc.study.dto.CreateRentalRequest;
import com.umc.study.entity.Book;
import com.umc.study.entity.Rental;
import com.umc.study.repository.BookRepository;
import com.umc.study.repository.RentalRepository;

import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.server.ResponseStatusException;

@Service
@RequiredArgsConstructor
public class RentalService {

    private final RentalRepository rentalRepository;
    private final BookRepository bookRepository;

    // 1. 도서 대여
    @Transactional
    public void createRental(CreateRentalRequest request) {

        // 대여할 책이 존재하는지 확인
        Book book = bookRepository.findById(request.bookId())
                .orElseThrow(() -> new ResponseStatusException(
                        HttpStatus.NOT_FOUND,
                        "존재하지 않는 도서입니다."
                ));

        // Rental 엔티티 생성
        Rental rental = new Rental(request.userId(), book);

        // JPA로 저장
        rentalRepository.save(rental);
    }

    // 2. 도서 반납
    @Transactional
    public void returnRental(Long rentalId) {

        // 대여 기록 조회
        Rental rental = rentalRepository.findById(rentalId)
                .orElseThrow(() -> new ResponseStatusException(
                        HttpStatus.NOT_FOUND,
                        "존재하지 않는 대여 기록입니다."
                ));

        // 이미 반납한 도서인지 확인
        if (rental.getReturnedAt() != null) {
            throw new ResponseStatusException(
                    HttpStatus.CONFLICT,
                    "이미 반납된 도서입니다."
            );
        }

        // 반납 시간 기록
        rental.returnBook();
    }
}