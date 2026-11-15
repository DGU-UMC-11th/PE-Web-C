package com.umc.movie.service;

import com.umc.movie.dto.EmailCheckResponse;
import com.umc.movie.dto.MemberInfoResponse;
import com.umc.movie.dto.MemberResponse;
import com.umc.movie.dto.MemberUpdateRequest;
import com.umc.movie.dto.NicknameCheckResponse;
import com.umc.movie.dto.SignUpRequest;
import com.umc.movie.entity.Member;
import com.umc.movie.exception.ApiException;
import com.umc.movie.repository.MemberRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

@Service
@RequiredArgsConstructor
public class MemberService {

    private final MemberRepository memberRepository;
    private final PasswordEncoder passwordEncoder; // 6주차: 비밀번호 해시용

    // 이미 있으면 사용할 수 없으므로 available = !exists
    @Transactional(readOnly = true)
    public NicknameCheckResponse checkNickname(String nickname) {
        boolean exists = memberRepository.existsByNickname(nickname);
        return new NicknameCheckResponse(!exists);
    }

    @Transactional(readOnly = true)
    public EmailCheckResponse checkEmail(String email) {
        boolean exists = memberRepository.existsByEmail(email);
        return new EmailCheckResponse(!exists);
    }

    // "두 번째 문": 형식은 맞지만 업무 규칙(중복)에 걸리는지 서비스에서 확인해요.
    // 선택 미션: 이메일 중복과 닉네임 중복을 다른 code로 구분해요.
    @Transactional
    public MemberResponse signUp(SignUpRequest request) {
        if (memberRepository.existsByEmail(request.email())) {
            throw new ApiException(HttpStatus.CONFLICT, "MEMBER4091", "이미 사용 중인 이메일입니다.");
        }
        if (memberRepository.existsByNickname(request.nickname())) {
            throw new ApiException(HttpStatus.CONFLICT, "MEMBER4092", "이미 사용 중인 닉네임입니다.");
        }

        Member member = Member.builder()
                .email(request.email())
                // 평문은 저장하지 않아요. bcrypt 해시(60자)만 저장해요.
                .password(passwordEncoder.encode(request.password()))
                .nickname(request.nickname())
                .build();

        // 여기서 동시에 같은 이메일이 들어오면 DB UNIQUE가 막고, DataIntegrityViolationException → 409로 변환돼요.
        Member savedMember = memberRepository.save(member);
        return MemberResponse.from(savedMember);
    }

    // 7주차: 내 정보 조회. memberId는 URL이 아니라 토큰(인터셉터)에서 와요.
    @Transactional(readOnly = true)
    public MemberInfoResponse getMyInfo(Long memberId) {
        Member member = memberRepository.findById(memberId)
                .orElseThrow(() -> new ApiException(HttpStatus.NOT_FOUND, "MEMBER404_1", "해당 회원을 찾을 수 없습니다."));

        return MemberInfoResponse.from(member);
    }

    // 7주차: 내 정보 수정 (닉네임)
    @Transactional
    public MemberInfoResponse updateMyInfo(Long memberId, MemberUpdateRequest request) {
        Member member = memberRepository.findById(memberId)
                .orElseThrow(() -> new ApiException(HttpStatus.NOT_FOUND, "MEMBER404_1", "해당 회원을 찾을 수 없습니다."));

        // "나 자신이 쓰고 있는 닉네임"은 중복이 아니에요. 나를 뺀 다른 회원이 쓰고 있을 때만 막아요.
        // DB에도 UNIQUE 제약이 있지만, 제약 위반 예외 대신 우리가 정한 응답을 주려고 먼저 확인해요.
        if (memberRepository.existsByNicknameAndMemberIdNot(request.nickname(), memberId)) {
            throw new ApiException(HttpStatus.CONFLICT, "MEMBER409_1", "이미 사용 중인 닉네임입니다.");
        }

        member.updateNickname(request.nickname()); // 영속 상태라 커밋 시 UPDATE (dirty checking)

        return MemberInfoResponse.from(member);
    }
}
