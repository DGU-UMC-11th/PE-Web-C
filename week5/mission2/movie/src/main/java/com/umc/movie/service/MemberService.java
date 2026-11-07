package com.umc.movie.service;

import com.umc.movie.dto.EmailCheckResponse;
import com.umc.movie.dto.NicknameCheckResponse;
import com.umc.movie.repository.MemberRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.server.ResponseStatusException;

import java.util.regex.Pattern;

@Service
@RequiredArgsConstructor
public class MemberService {

    private final MemberRepository memberRepository;

    private static final Pattern EMAIL_PATTERN = Pattern.compile(
            "^[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\\.[A-Za-z]{2,}$"
    );

    @Transactional(readOnly = true)
    public NicknameCheckResponse checkNickname(String nickname) {

        // 닉네임 2~12자 검증
        if (nickname == null || nickname.isBlank()
                || nickname.length() < 2 || nickname.length() > 12) {
            throw new ResponseStatusException(
                    HttpStatus.BAD_REQUEST,
                    "닉네임은 2~12자여야 합니다."
            );
        }

        boolean exists = memberRepository.existsByNickname(nickname);
        return new NicknameCheckResponse(!exists);
    }

    @Transactional(readOnly = true)
    public EmailCheckResponse checkEmail(String email) {

        // 이메일 형식 검증
        if (email == null || !EMAIL_PATTERN.matcher(email).matches()) {
            throw new ResponseStatusException(
                    HttpStatus.BAD_REQUEST,
                    "올바른 이메일 형식이 아닙니다."
            );
        }

        boolean exists = memberRepository.existsByEmail(email);
        return new EmailCheckResponse(!exists);
    }
}
