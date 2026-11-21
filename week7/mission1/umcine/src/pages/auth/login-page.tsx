import { useEffect, useRef, useState, type SubmitEvent } from "react";
import { Link, useNavigate } from "@tanstack/react-router";
import { useQueryClient } from "@tanstack/react-query";
import { login } from "../../api/auth/login";
import { beginLoginRequest, finishLoginRequest, isCurrentLoginRequest } from "../../utils/login-request";
import { AuthCard, AuthField, primaryButtonClass } from "../../components/auth/auth-ui";
import { useAuthStore } from "../../stores/auth-store";
import { EMAIL_REGEX } from "../../utils/auth-validation";
import { getMemberErrorMessage } from "../../utils/get-member-error-message";

export function LoginPage() {
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  const signIn = useAuthStore((state) => state.signIn);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const pending = useRef(false);
  const request = useRef<AbortController | null>(null);

  useEffect(() => () => {
    request.current?.abort();
    request.current = null;
  }, []);
  const isEmailValid = EMAIL_REGEX.test(email.trim());

  async function handleSubmit(event: SubmitEvent<HTMLFormElement>) {
    event.preventDefault();
    if (!isEmailValid || !password.trim() || pending.current) return;
    pending.current = true;
    const controller = beginLoginRequest();
    request.current = controller;
    setIsSubmitting(true);
    setError("");
    try {
      const result = await login({ email: email.trim(), password }, controller.signal);
      if (!isCurrentLoginRequest(controller)) return;
      await queryClient.cancelQueries({ queryKey: ["members"] });
      if (!isCurrentLoginRequest(controller)) return;
      queryClient.removeQueries({ queryKey: ["members"] });
      signIn(result.accessToken, result.nickname);
      setPassword("");
      void navigate({ to: "/mypage" });
    } catch (error) {
      if (!isCurrentLoginRequest(controller)) return;
      setError(getMemberErrorMessage(error, "로그인에 실패했어요. 잠시 후 다시 시도해 주세요."));
    } finally {
      if (request.current === controller) {
        request.current = null;
        pending.current = false;
        setIsSubmitting(false);
      }
      finishLoginRequest(controller);
    }
  }

  return (
    <AuthCard title="로그인" description="다시 만나 반가워요. 오늘은 어떤 영화를 볼까요?">
      <form onSubmit={handleSubmit} noValidate aria-busy={isSubmitting} className="space-y-5">
        <AuthField required id="login-email" label="이메일" type="email" autoComplete="username" placeholder="example@email.com"
          value={email} disabled={isSubmitting} onChange={(e) => { setEmail(e.target.value); setError(""); }}
          error={email.length > 0 && !isEmailValid ? "올바른 이메일 형식으로 입력해 주세요." : undefined} />
        <AuthField required id="login-password" label="비밀번호" type="password" autoComplete="current-password" placeholder="비밀번호를 입력해 주세요"
          value={password} disabled={isSubmitting} onChange={(e) => { setPassword(e.target.value); setError(""); }} />
        {error && <p role="alert" className="rounded-lg bg-red-50 p-3 text-sm text-red-700">{error}</p>}
        <button type="submit" disabled={!isEmailValid || !password.trim() || isSubmitting} className={primaryButtonClass}>{isSubmitting ? "로그인 중" : "로그인"}</button>
      </form>
      <p className="mt-6 text-center text-sm text-[#656a73]">아직 계정이 없으신가요? <Link to="/signup" className="ml-1 font-bold text-blue-600 hover:underline">회원가입</Link></p>
    </AuthCard>
  );
}
