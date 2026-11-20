package com.umc.study.resolver;

import com.umc.study.annotation.LoginMember;
import com.umc.study.exception.ApiException;
import com.umc.study.interceptor.AuthInterceptor;
import org.springframework.core.MethodParameter;
import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Component;
import org.springframework.web.bind.support.WebDataBinderFactory;
import org.springframework.web.context.request.NativeWebRequest;
import org.springframework.web.context.request.RequestAttributes;
import org.springframework.web.method.support.HandlerMethodArgumentResolver;
import org.springframework.web.method.support.ModelAndViewContainer;

/**
 * 선택 미션: @LoginMember가 붙은 Long 파라미터에 인터셉터가 담아둔 memberId를 넣어줘요.
 * 덕분에 컨트롤러에서 "memberId"라는 문자열을 직접 쓰는 곳이 사라져요.
 */
@Component
public class LoginMemberArgumentResolver implements HandlerMethodArgumentResolver {

    @Override
    public boolean supportsParameter(MethodParameter parameter) {
        return parameter.hasParameterAnnotation(LoginMember.class)
                && Long.class.equals(parameter.getParameterType());
    }

    @Override
    public Object resolveArgument(
            MethodParameter parameter,
            ModelAndViewContainer mavContainer,
            NativeWebRequest webRequest,
            WebDataBinderFactory binderFactory
    ) {
        Object memberId = webRequest.getAttribute(AuthInterceptor.MEMBER_ID, RequestAttributes.SCOPE_REQUEST);

        // 인터셉터를 거치지 않은 경로에 @LoginMember를 붙이면 값이 비어 있어요.
        if (memberId == null) {
            throw new ApiException(HttpStatus.UNAUTHORIZED, "AUTH401_2",
                    "로그인이 필요한 요청입니다.");
        }

        return memberId;
    }
}
