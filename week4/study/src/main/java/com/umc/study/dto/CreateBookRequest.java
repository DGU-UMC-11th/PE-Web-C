package com.umc.study.dto;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Size;

// POST /books 요청 Body: { "categoryId": 1, "title": "책 제목", "description": "설명(선택)" }
public record CreateBookRequest(
        @NotNull(message = "카테고리 ID는 필수입니다.")
        Long categoryId,

        @NotBlank(message = "제목은 비어 있을 수 없습니다.")
        @Size(max = 100, message = "제목은 100자 이하여야 합니다.")
        String title,

        String description
) {
}
