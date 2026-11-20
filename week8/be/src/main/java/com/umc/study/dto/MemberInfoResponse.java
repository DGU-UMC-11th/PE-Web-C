package com.umc.study.dto;

import com.umc.study.domain.Member;

import java.time.LocalDateTime;

public record MemberInfoResponse(
        Long memberId,
        String email,
        String nickname,
        LocalDateTime createdAt
) {
    // 엔티티를 그대로 응답하면 password까지 나가므로 반드시 DTO로 옮겨 담아요.
    // memberId는 프론트가 공개 API인 GET /members/{memberId}/ratings 를 부를 때 필요해서 함께 내려줘요.
    public static MemberInfoResponse from(Member member) {
        return new MemberInfoResponse(
                member.getMemberId(),
                member.getEmail(),
                member.getNickname(),
                member.getCreatedAt()
        );
    }
}
