package com.umc.movie.entity;

import jakarta.persistence.Column;
import jakarta.persistence.MappedSuperclass;
import lombok.Getter;
import org.hibernate.annotations.CreationTimestamp;
import org.hibernate.annotations.UpdateTimestamp;

import java.time.LocalDateTime;

/**
 * 그 자체로 테이블이 되지는 않지만, 상속하는 자식 엔티티에게 컬럼 정의를 물려줘요.
 * Member, Rating, (8주차) Favorite이 생성/수정 시각을 똑같이 가지므로 한 곳에 모았어요.
 */
@Getter
@MappedSuperclass
public abstract class BaseTimeEntity {

    // INSERT 시점에 한 번만 채워지고 이후 바뀌지 않아요.
    @CreationTimestamp
    @Column(name = "created_at", nullable = false, updatable = false)
    private LocalDateTime createdAt;

    // 저장(INSERT/UPDATE)될 때마다 현재 시각으로 다시 채워져요.
    @UpdateTimestamp
    @Column(name = "updated_at", nullable = false)
    private LocalDateTime updatedAt;
}
