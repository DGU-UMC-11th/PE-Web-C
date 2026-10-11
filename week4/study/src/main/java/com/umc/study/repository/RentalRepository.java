package com.umc.study.repository;

import com.umc.study.entity.Rental;
import jakarta.persistence.LockModeType;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Lock;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import java.util.Optional;

public interface RentalRepository extends JpaRepository<Rental, Long> {

    // 반납 시 대여 기록 잠금
    @Lock(LockModeType.PESSIMISTIC_WRITE)
    @Query("SELECT r FROM Rental r WHERE r.rentalId = :rentalId")
    Optional<Rental> findByIdForUpdate(@Param("rentalId") Long rentalId);
}