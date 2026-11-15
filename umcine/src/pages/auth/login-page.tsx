import { Link, useNavigate } from "@tanstack/react-router";
import { useState, type SubmitEvent } from "react";
import { AuthCard, FormField, IconInput, PRIMARY_BUTTON_CLASS } from "../../components/form/form-field";
import { useProfileStore } from "../../stores/profile-store";
import { cn } from "../../utils/cn";
import { isValidEmail } from "../../utils/validators";

// 7주차 필수 미션: 로그인 화면 퍼블리싱. 로그인 API(POST /auth/login) 연동은 8주차에 해요.
export function LoginPage() {
  const navigate = useNavigate();
  const profile = useProfileStore((state) => state.profile);
  const setProfile = useProfileStore((state) => state.setProfile);

  const [form, setForm] = useState({ email: "", password: "" });
  const [isSubmitting, setIsSubmitting] = useState(false);

  const isEmailValid = isValidEmail(form.email);
  // 로그인에서는 비밀번호 규칙까지 검사하지 않아요. 규칙이 바뀌기 전에 가입한 회원도 로그인해야 하니까요.
  const isPasswordFilled = form.password.length > 0;
  const showEmailError = form.email.length > 0 && !isEmailValid;
  const canSubmit = isEmailValid && isPasswordFilled;

  const handleSubmit = (event: SubmitEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (!canSubmit || isSubmitting) return;

    setIsSubmitting(true);
    // 8주차에 POST /auth/login 호출로 바꿔요. 지금은 입력한 이메일을 내 정보 화면에 반영만 해요.
    const email = form.email.trim();
    setProfile({ email, nickname: profile?.email === email ? profile.nickname : email.split("@")[0] });
    setIsSubmitting(false);
    navigate({ to: "/me" });
  };

  return (
    <AuthCard title="로그인">
      <form className="flex flex-col gap-5" onSubmit={handleSubmit} noValidate>
        <FormField id="login-email" label="이메일" error={showEmailError ? "이메일 형식을 확인해 주세요." : null}>
          <IconInput
            id="login-email"
            icon="/icons/mail.svg"
            type="email"
            autoComplete="email"
            placeholder="name@example.com"
            hasError={showEmailError}
            value={form.email}
            onChange={(event) => setForm((prev) => ({ ...prev, email: event.target.value }))}
          />
        </FormField>

        <FormField id="login-password" label="비밀번호">
          <IconInput
            id="login-password"
            icon="/icons/lock.svg"
            type="password"
            autoComplete="current-password"
            placeholder="비밀번호"
            value={form.password}
            onChange={(event) => setForm((prev) => ({ ...prev, password: event.target.value }))}
          />
        </FormField>

        <button type="submit" className={cn(PRIMARY_BUTTON_CLASS, "mt-1 w-full")} disabled={!canSubmit || isSubmitting}>
          {isSubmitting ? "로그인 중" : "로그인"}
        </button>

        <p className="text-center text-xs text-text-secondary">
          처음이신가요?{" "}
          <Link to="/signup" className="font-bold text-action-primary hover:underline">
            회원가입
          </Link>
        </p>
      </form>
    </AuthCard>
  );
}
