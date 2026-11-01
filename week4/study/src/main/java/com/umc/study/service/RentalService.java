package com.umc.study.service;

import com.umc.study.dto.RentalRequest;
import com.umc.study.repository.RentalRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

@Service
@RequiredArgsConstructor
public class RentalService {

    private final RentalRepository rentalRepository;

    public void createRental(RentalRequest request) {
        rentalRepository.save(request.userId(), request.bookId());
    }
}
