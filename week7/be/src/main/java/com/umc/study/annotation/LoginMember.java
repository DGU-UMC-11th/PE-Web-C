package com.umc.study.annotation;

import java.lang.annotation.ElementType;
import java.lang.annotation.Retention;
import java.lang.annotation.RetentionPolicy;
import java.lang.annotation.Target;

/**
 * 선택 미션: 컨트롤러에서 @RequestAttribute("memberId")를 반복해서 쓰지 않으려고 만든 어노테이션이에요.
 * 이름만 봐도 "이 값은 로그인한 사용자에게서 온다"는 게 드러나요.
 */
@Target(ElementType.PARAMETER)
@Retention(RetentionPolicy.RUNTIME)
public @interface LoginMember {
}
