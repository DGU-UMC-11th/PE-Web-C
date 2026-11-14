package com.umc.study.service;

import com.umc.study.domain.Member;
import com.umc.study.dto.EmailCheckResponse;
import com.umc.study.dto.MemberInfoResponse;
import com.umc.study.dto.MemberResponse;
import com.umc.study.dto.MemberUpdateRequest;
import com.umc.study.dto.NicknameCheckResponse;
import com.umc.study.dto.SignUpRequest;
import com.umc.study.exception.ApiException;
import com.umc.study.exception.DuplicateException;
import com.umc.study.repository.MemberRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
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
        return MemberResponse.from(memberRepository.save(member));
    }

    // 7주차: URL 어디에도 누구의 정보인지가 없어요. 토큰이 알려줘요.
    public MemberInfoResponse getMyInfo(Long memberId) {
        return MemberInfoResponse.from(findMember(memberId));
    }

    @Transactional
    public MemberInfoResponse updateMyInfo(Long memberId, MemberUpdateRequest request) {
        Member member = findMember(memberId);

        // 나를 제외한 다른 회원이 그 닉네임을 쓰고 있다면 막아요.
        // 내가 쓰던 닉네임을 그대로 두고 저장할 때 막히면 곤란하니까요.
        if (memberRepository.existsByNicknameAndMemberIdNot(request.nickname(), memberId)) {
            throw new ApiException(HttpStatus.CONFLICT, "MEMBER409_1",
                    "이미 사용 중인 닉네임입니다.");
        }

        member.updateNickname(request.nickname());
        memberRepository.save(member);

        return MemberInfoResponse.from(member);
    }

    private Member findMember(Long memberId) {
        return memberRepository.findById(memberId)
                .orElseThrow(() -> new ApiException(HttpStatus.NOT_FOUND, "MEMBER404_1",
                        "해당 회원을 찾을 수 없습니다."));
    }
}
