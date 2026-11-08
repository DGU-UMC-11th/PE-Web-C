package com.umc.movie.repository;

import com.umc.movie.entity.Member;
import org.springframework.data.jpa.repository.JpaRepository;

public interface MemberRepository extends JpaRepository<Member, Long> {

    // 메서드 이름만으로 SELECT ... LIMIT 1 형태의 존재 여부 쿼리가 만들어져요.
    boolean existsByNickname(String nickname);

    boolean existsByEmail(String email);
}
