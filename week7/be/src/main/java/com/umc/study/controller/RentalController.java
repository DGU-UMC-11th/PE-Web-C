package com.umc.study.controller;

import com.umc.study.service.RentalService;
import lombok.RequiredArgsConstructor;
import org.springframework.web.bind.annotation.*;

import java.util.Map;

@RestController
@RequestMapping("/rentals")
@RequiredArgsConstructor
public class RentalController {

    private final RentalService rentalService;

    // [미션 2] POST /rentals
    @PostMapping
    public String createRental(@RequestBody Map<String, Object> body) {
        rentalService.createRental(body);
        return "대여 기록이 생성되었습니다!";
    }

    // [선택] PATCH /rentals/1/return
    @PatchMapping("/{rentalId}/return")
    public String returnBook(@PathVariable Long rentalId) {
        int updated = rentalService.returnBook(rentalId);
        return updated > 0 ? "반납 처리가 완료되었습니다!" : "해당 대여 기록이 없습니다.";
    }
}