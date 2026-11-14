package com.umc.study.repository;

import com.umc.study.domain.Member;
import org.springframework.data.jpa.repository.JpaRepository;

public interface MemberRepository extends JpaRepository<Member, Long> {

    // 중복 체크는 엔티티를 꺼내올 필요가 없어서 exists 쿼리가 더 가벼워요.
    boolean existsByNickname(String nickname);

    boolean existsByEmail(String email);
}
