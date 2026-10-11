package com.umc.study.controller;

import com.umc.study.dto.RentalRequest;
import com.umc.study.service.RentalService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequiredArgsConstructor
public class RentalController {

    private final RentalService rentalService;

    // POST http://localhost:8080/rentals
    @PostMapping("/rentals")
    public ResponseEntity<String> createRental(@RequestBody RentalRequest request) {
        rentalService.createRental(request);
        return ResponseEntity.status(HttpStatus.CREATED).body("대여 기록이 생성되었습니다.");
    }
}
