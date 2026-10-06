package com.umc.study.controller;

import com.umc.study.service.RentalService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.Map;

@RestController
@RequestMapping("/rentals")
@RequiredArgsConstructor
public class RentalController {

    private final RentalService rentalService;

    @PostMapping
    public String createRental(@RequestBody Map<String, Object> body) {
        rentalService.createRental(body);
        return "도서 대여 기록이 생성되었습니다!";
    }

    @PatchMapping("/{rentalId}/return")
    public ResponseEntity<String> returnRental(
            @PathVariable Long rentalId
    ) {
        boolean success =
                rentalService.returnRental(rentalId);

        if (!success) {
            return ResponseEntity.badRequest()
                    .body("이미 반납되었거나 존재하지 않는 대여 기록입니다.");
        }

        return ResponseEntity.ok(
                "도서 반납이 완료되었습니다!"
        );
    }
}