package com.umc.study.exception;

import lombok.Getter;

// 이메일 중복과 닉네임 중복을 서로 다른 code로 구분하기 위한 예외예요. (선택 미션)
@Getter
public class DuplicateException extends RuntimeException {

    private final String code;

    public DuplicateException(String code, String message) {
        super(message);
        this.code = code;
    }

    public static DuplicateException email() {
        return new DuplicateException("MEMBER4091", "이미 사용 중인 이메일입니다.");
    }

    public static DuplicateException nickname() {
        return new DuplicateException("MEMBER4092", "이미 사용 중인 닉네임입니다.");
    }

    public static DuplicateException rating() {
        return new DuplicateException("RATING4091", "이미 이 영화에 평점을 남기셨습니다.");
    }
}
