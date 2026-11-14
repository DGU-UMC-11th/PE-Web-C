package com.umc.study.service;

import com.umc.study.domain.Member;
import com.umc.study.dto.LoginRequest;
import com.umc.study.dto.LoginResponse;
import com.umc.study.exception.ApiException;
import com.umc.study.repository.MemberRepository;
import com.umc.study.util.JwtUtil;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

@Service
@RequiredArgsConstructor
@Transactional(readOnly = true)
public class AuthService {

    private final MemberRepository memberRepository;
    private final PasswordEncoder passwordEncoder; // 6주차 회원가입에서 등록해둔 Bean
    private final JwtUtil jwtUtil;

    public LoginResponse login(LoginRequest request) {
        // 1. 이메일로 회원을 찾아요.
        //    "가입되지 않은 이메일"이라고 알려주면 공격자가 가입 여부를 알아낼 수 있어서,
        //    없을 때도 비밀번호가 틀렸을 때와 똑같은 응답을 줘요.
        Member member = memberRepository.findByEmail(request.email())
                .orElseThrow(() -> new ApiException(HttpStatus.UNAUTHORIZED, "AUTH401_1",
                        "이메일 또는 비밀번호가 올바르지 않습니다."));

        // 2. 입력한 비밀번호를 저장된 해시와 비교해요.
        //    matches()가 저장된 해시에서 salt를 꺼내 같은 방식으로 해시한 뒤 대조해줘요.
        if (!passwordEncoder.matches(request.password(), member.getPassword())) {
            throw new ApiException(HttpStatus.UNAUTHORIZED, "AUTH401_1",
                    "이메일 또는 비밀번호가 올바르지 않습니다.");
        }

        // 3. 검증을 통과했으니 토큰을 발급해요.
        String accessToken = jwtUtil.createAccessToken(member.getMemberId(), member.getEmail());

        return new LoginResponse(member.getNickname(), accessToken);
    }
}
