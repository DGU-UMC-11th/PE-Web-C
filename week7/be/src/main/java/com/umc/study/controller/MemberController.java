package com.umc.study.controller;

import com.umc.study.annotation.LoginMember;
import com.umc.study.dto.ApiResponse;
import com.umc.study.dto.EmailCheckResponse;
import com.umc.study.dto.MemberInfoResponse;
import com.umc.study.dto.MemberResponse;
import com.umc.study.dto.MemberUpdateRequest;
import com.umc.study.dto.NicknameCheckResponse;
import com.umc.study.dto.SignUpRequest;
import com.umc.study.service.MemberService;
import jakarta.validation.Valid;
import jakarta.validation.constraints.Email;
import jakarta.validation.constraints.Size;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.validation.annotation.Validated;
import org.springframework.web.bind.annotation.*;

@RestController
@RequiredArgsConstructor
@RequestMapping("/members")
@Validated
public class MemberController {

    private final MemberService memberService;

    // 고정 경로(/me)는 변수 경로(/{...})보다 위에 둬야 me가 변수로 잡히지 않아요.
    @GetMapping("/me")
    public ResponseEntity<ApiResponse<MemberInfoResponse>> getMyInfo(@LoginMember Long memberId) {
        MemberInfoResponse response = memberService.getMyInfo(memberId);
        return ResponseEntity.ok(ApiResponse.ok("회원 정보를 조회했습니다.", response));
    }

    @PatchMapping("/me")
    public ResponseEntity<ApiResponse<MemberInfoResponse>> updateMyInfo(
            @LoginMember Long memberId,
            @RequestBody @Valid MemberUpdateRequest request
    ) {
        MemberInfoResponse response = memberService.updateMyInfo(memberId, request);
        return ResponseEntity.ok(ApiResponse.ok("회원 정보를 수정했습니다.", response));
    }

    @GetMapping("/nickname/{nickname}")
    public NicknameCheckResponse checkNickname(
            @PathVariable @Size(min = 2, max = 12, message = "닉네임은 2~12자로 입력해 주세요.") String nickname) {
        return memberService.checkNickname(nickname);
    }

    @GetMapping("/email/{email}")
    public EmailCheckResponse checkEmail(
            @PathVariable @Email(message = "이메일 형식이 올바르지 않습니다.") String email) {
        return memberService.checkEmail(email);
    }

    // 회원가입 — 성공하면 201 Created, 응답에 password는 절대 포함하지 않아요.
    @PostMapping
    public ResponseEntity<ApiResponse<MemberResponse>> signUp(@Valid @RequestBody SignUpRequest request) {
        MemberResponse response = memberService.signUp(request);
        return ResponseEntity.status(HttpStatus.CREATED)
                .body(ApiResponse.created("회원가입에 성공했습니다.", response));
    }
}
