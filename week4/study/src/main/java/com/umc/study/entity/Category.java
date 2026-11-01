package com.umc.study.entity;

import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.Table;
import lombok.AccessLevel;
import lombok.Getter;
import lombok.NoArgsConstructor;

// category 테이블 한 행 = Category 객체 하나
@Entity
@Table(name = "category")
@Getter
@NoArgsConstructor(access = AccessLevel.PROTECTED) // JPA가 객체를 만들 때 쓰는 기본 생성자 (외부에서 빈 객체 생성 금지)
public class Category {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY) // AUTO_INCREMENT를 DB에 맡겨요.
    @Column(name = "category_id") // DB의 snake_case 컬럼명 ↔ 코드의 camelCase 필드명
    private Long categoryId;

    @Column(nullable = false)
    private String name;
}
