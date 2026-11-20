package com.umc.study.dto;

// 즐겨찾기하지 않은 것은 오류가 아니라 정상 상태예요. 그래서 200 + isFavorite: false 로 응답해요.
public record FavoriteStatusResponse(
        boolean isFavorite
) {
}
