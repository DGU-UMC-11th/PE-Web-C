package com.umc.study.controller;

import com.umc.study.dto.CreateRentalRequest;
import com.umc.study.service.RentalService;

import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/rentals")
@RequiredArgsConstructor
public class RentalController {

    private final RentalService rentalService;

    // POST /rentals
    @PostMapping
    public String createRental(
            @Valid @RequestBody CreateRentalRequest request
    ) {
        rentalService.createRental(request);
        return "도서 대여가 완료되었습니다!";
    }

    // PATCH /rentals/{rentalId}/return
    @PatchMapping("/{rentalId}/return")
    public String returnRental(@PathVariable Long rentalId) {
        rentalService.returnRental(rentalId);
        return "도서 반납이 완료되었습니다!";
    }
}