package com.umc.movie.repository;

import com.umc.movie.entity.Member;
import org.springframework.data.jpa.repository.JpaRepository;

public interface MemberRepository extends JpaRepository<Member, Long> {

    // 메서드 이름만으로 쿼리가 만들어지는 Query Method예요.
    boolean existsByNickname(String nickname);

    boolean existsByEmail(String email);
}
