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
    public Long createRental(CreateRentalRequest request) {

        // 도서 행 잠금 후 조회
        Book book = bookRepository.findByIdForUpdate(request.bookId())
                .orElseThrow(() -> new ResponseStatusException(
                        HttpStatus.NOT_FOUND,
                        "존재하지 않는 도서입니다."
                ));

        // 대여 가능 여부 확인
        if (!Boolean.TRUE.equals(book.getIsAvailable())) {
            throw new ResponseStatusException(
                    HttpStatus.CONFLICT,
                    "이미 대여 중인 도서입니다."
            );
        }

        // 대여 불가능 상태로 변경
        book.markRented();

        // 대여 기록 생성 및 저장
        Rental rental = new Rental(request.userId(), book);
        Rental savedRental = rentalRepository.save(rental);

        // 생성된 대여 ID 반환
        return savedRental.getRentalId();
    }

    // 2. 도서 반납
    @Transactional
    public void returnRental(Long rentalId) {

        // 대여 기록을 잠근 뒤 조회
        Rental rental = rentalRepository.findByIdForUpdate(rentalId)
                .orElseThrow(() -> new ResponseStatusException(
                        HttpStatus.NOT_FOUND,
                        "존재하지 않는 대여 기록입니다."
                ));

        // 중복 반납 확인
        if (rental.getReturnedAt() != null) {
            throw new ResponseStatusException(
                    HttpStatus.CONFLICT,
                    "이미 반납된 도서입니다."
            );
        }

        // 도서 행 잠금
        Book book = bookRepository.findByIdForUpdate(
                rental.getBook().getBookId()
        ).orElseThrow(() -> new ResponseStatusException(
                HttpStatus.NOT_FOUND,
                "존재하지 않는 도서입니다."
        ));

        // 반납 처리 및 대여 가능 상태 변경
        rental.returnBook();
        book.markAvailable();
    }
}