package com.umc.movie.repository;

import com.umc.movie.entity.Member;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.Optional;

public interface MemberRepository extends JpaRepository<Member, Long> {

    // 메서드 이름만으로 SELECT ... LIMIT 1 형태의 존재 여부 쿼리가 만들어져요.
    boolean existsByNickname(String nickname);

    boolean existsByEmail(String email);

    // 7주차 로그인: 이메일로 회원 자체를 꺼내 와요 (비밀번호 해시를 비교해야 하니까)
    Optional<Member> findByEmail(String email);

    // 7주차 내 정보 수정: "이 닉네임을 쓰는 회원이 있는가? 단, 나 자신은 빼고"
    boolean existsByNicknameAndMemberIdNot(String nickname, Long memberId);
}
