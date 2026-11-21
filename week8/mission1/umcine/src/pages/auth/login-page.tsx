import { useState, type SubmitEvent } from "react";
import { Link } from "@tanstack/react-router";
import { AuthCard, AuthField, primaryButtonClass } from "../../components/auth/auth-ui";
import { useLoginMutation } from "../../hooks/use-login-mutation";
import { EMAIL_REGEX } from "../../utils/auth-validation";
import { getMemberErrorMessage } from "../../utils/get-member-error-message";

export function LoginPage() {
  const loginMutation = useLoginMutation();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const isEmailValid = EMAIL_REGEX.test(email.trim());
  const canSubmit = isEmailValid && password.length > 0;
  const isSubmitting = loginMutation.isPending;
  const error = loginMutation.isError
    ? getMemberErrorMessage(loginMutation.error, "로그인에 실패했어요. 다시 시도해 주세요.")
    : "";

  function handleSubmit(event: SubmitEvent<HTMLFormElement>) {
    event.preventDefault();
    if (!canSubmit || isSubmitting) return;
    loginMutation.submit({ email: email.trim(), password });
  }

  return (
    <AuthCard title="로그인" description="다시 만나 반가워요. 오늘은 어떤 영화를 볼까요?">
      <form onSubmit={handleSubmit} noValidate aria-busy={isSubmitting} className="space-y-5">
        <AuthField required id="login-email" label="이메일" type="email" autoComplete="username" placeholder="example@email.com"
          value={email} disabled={isSubmitting} onChange={(e) => { setEmail(e.target.value); loginMutation.reset(); }}
          error={email.length > 0 && !isEmailValid ? "올바른 이메일 형식으로 입력해 주세요." : undefined} />
        <AuthField required id="login-password" label="비밀번호" type="password" autoComplete="current-password" placeholder="비밀번호를 입력해 주세요"
          value={password} disabled={isSubmitting} onChange={(e) => { setPassword(e.target.value); loginMutation.reset(); }} />
        {error && <p role="alert" className="rounded-lg bg-red-50 p-3 text-sm text-red-700">{error}</p>}
        <button type="submit" disabled={!canSubmit || isSubmitting} className={primaryButtonClass}>{isSubmitting ? "로그인 중" : "로그인"}</button>
      </form>
      <p className="mt-6 text-center text-sm text-[#656a73]">아직 계정이 없으신가요? <Link to="/signup" className="ml-1 font-bold text-blue-600 hover:underline">회원가입</Link></p>
    </AuthCard>
  );
}
