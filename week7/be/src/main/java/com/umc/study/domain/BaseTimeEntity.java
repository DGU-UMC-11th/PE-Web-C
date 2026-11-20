package com.umc.study.domain;

import jakarta.persistence.Column;
import jakarta.persistence.MappedSuperclass;
import lombok.Getter;
import org.hibernate.annotations.CreationTimestamp;
import org.hibernate.annotations.UpdateTimestamp;

import java.time.LocalDateTime;

// 생성/수정 시각을 쓰는 엔티티가 상속받아요.
@Getter
@MappedSuperclass
public abstract class BaseTimeEntity {

    // INSERT 시점에 한 번만 채워지고 이후 바뀌지 않아요.
    @CreationTimestamp
    @Column(name = "created_at", nullable = false, updatable = false)
    private LocalDateTime createdAt;

    // 저장될 때마다 현재 시각으로 다시 채워져요.
    @UpdateTimestamp
    @Column(name = "updated_at", nullable = false)
    private LocalDateTime updatedAt;
}
