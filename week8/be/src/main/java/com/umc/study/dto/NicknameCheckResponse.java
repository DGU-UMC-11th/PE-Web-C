package com.umc.study.dto;

// available = true 면 아직 쓸 수 있는 닉네임이에요.
public record NicknameCheckResponse(boolean available) {
}
