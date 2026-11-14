package com.umc.study.service;

import com.umc.study.domain.Member;
import com.umc.study.dto.EmailCheckResponse;
import com.umc.study.dto.MemberResponse;
import com.umc.study.dto.NicknameCheckResponse;
import com.umc.study.dto.SignUpRequest;
import com.umc.study.exception.DuplicateException;
import com.umc.study.repository.MemberRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

@Service
@RequiredArgsConstructor
@Transactional(readOnly = true)
public class MemberService {

    private final MemberRepository memberRepository;
    private final PasswordEncoder passwordEncoder;

    public NicknameCheckResponse checkNickname(String nickname) {
        return new NicknameCheckResponse(!memberRepository.existsByNickname(nickname));
    }

    public EmailCheckResponse checkEmail(String email) {
        return new EmailCheckResponse(!memberRepository.existsByEmail(email));
    }

    @Transactional
    public MemberResponse signUp(SignUpRequest request) {
        // 1. 이미 쓰고 있는 값인지 확인해요. (어느 쪽이 중복인지 구분해서 알려줘요)
        if (memberRepository.existsByEmail(request.email())) {
            throw DuplicateException.email();
        }
        if (memberRepository.existsByNickname(request.nickname())) {
            throw DuplicateException.nickname();
        }

        // 2. 비밀번호는 평문이 아니라 bcrypt 해시로 저장해요.
        Member member = Member.builder()
                .email(request.email())
                .password(passwordEncoder.encode(request.password()))
                .nickname(request.nickname())
                .build();

        // 3. 저장 후 password를 뺀 DTO만 돌려줘요.
        //    위 중복 검사를 통과해도 거의 동시에 같은 값이 들어오면 DB UNIQUE 제약이 막아주고,
        //    그 예외는 GlobalExceptionHandler가 409로 변환해요.
        return MemberResponse.from(memberRepository.save(member));
    }
}
