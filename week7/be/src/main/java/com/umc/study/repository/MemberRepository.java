package com.umc.study.repository;

import com.umc.study.domain.Member;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.Optional;

public interface MemberRepository extends JpaRepository<Member, Long> {

    // 중복 체크는 엔티티를 꺼내올 필요가 없어서 exists 쿼리가 더 가벼워요.
    boolean existsByNickname(String nickname);

    boolean existsByEmail(String email);

    // 로그인에서는 회원 자체(비밀번호 해시 포함)가 필요해요.
    Optional<Member> findByEmail(String email);

    // "이 닉네임을 쓰는 회원이 있는가? 단, 나 자신은 빼고" 를 한 번에 확인해요.
    boolean existsByNicknameAndMemberIdNot(String nickname, Long memberId);
}
