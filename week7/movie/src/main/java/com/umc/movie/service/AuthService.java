package com.umc.movie.service;

import com.umc.movie.dto.LoginRequest;
import com.umc.movie.dto.LoginResponse;
import com.umc.movie.entity.Member;
import com.umc.movie.exception.ApiException;
import com.umc.movie.repository.MemberRepository;
import com.umc.movie.util.JwtUtil;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

@Service
@RequiredArgsConstructor
public class AuthService {

    private final MemberRepository memberRepository;
    private final PasswordEncoder passwordEncoder; // 6주차 회원가입에서 등록해 둔 Bean
    private final JwtUtil jwtUtil;

    @Transactional(readOnly = true)
    public LoginResponse login(LoginRequest request) {
        // 1. 이메일로 회원을 찾아요.
        //    없어도 "가입되지 않은 이메일"이라고 알려주지 않아요. 어떤 이메일이 가입돼 있는지 알아내는 데 쓰일 수 있어서,
        //    이메일이 없을 때와 비밀번호가 틀렸을 때 모두 같은 응답(AUTH401_1)을 돌려줘요.
        Member member = memberRepository.findByEmail(request.email())
                .orElseThrow(() -> invalidCredentials());

        // 2. 입력한 비밀번호를 저장된 해시와 비교해요.
        //    matches()가 저장된 해시에서 salt를 꺼내 같은 방식으로 해시한 뒤 대조해요.
        if (!passwordEncoder.matches(request.password(), member.getPassword())) {
            throw invalidCredentials();
        }

        // 3. 검증을 통과했으니 토큰을 발급해요.
        String accessToken = jwtUtil.createAccessToken(member.getMemberId(), member.getEmail());

        return new LoginResponse(member.getNickname(), accessToken);
    }

    private ApiException invalidCredentials() {
        return new ApiException(HttpStatus.UNAUTHORIZED, "AUTH401_1", "이메일 또는 비밀번호가 올바르지 않습니다.");
    }
}
