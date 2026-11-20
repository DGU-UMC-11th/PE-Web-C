import { useState, type FormEvent } from "react";
import { Link } from "@tanstack/react-router";
import { TextField } from "../../components/form/text-field";

const EMAIL_REGEX = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

/**
 * 7주차는 퍼블리싱까지만 해요.
 * POST /auth/login 연동과 토큰 저장은 8주차에서 붙입니다.
 */
export function LoginPage() {
  const [form, setForm] = useState({ email: "", password: "" });

  const isEmailValid = EMAIL_REGEX.test(form.email.trim());
  const isPasswordFilled = form.password.length > 0;
  const showEmailError = form.email.length > 0 && !isEmailValid;

  const canSubmit = isEmailValid && isPasswordFilled;

  const handleChangeField = (key: "email" | "password", value: string) => {
    setForm((prev) => ({ ...prev, [key]: value }));
  };

  const handleSubmit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    // 8주차에 로그인 API 요청을 추가해요.
    alert("로그인 API는 8주차에 연결해요.");
  };

  return (
    <main className="mx-auto flex w-full max-w-[1440px] flex-1 justify-center px-4 py-12 sm:px-6 lg:px-20">
      <form
        onSubmit={handleSubmit}
        noValidate
        className="flex w-full max-w-[420px] flex-col gap-5 rounded-2xl border border-border bg-surface p-7"
      >
        <div className="flex flex-col gap-1.5">
          <h1 className="text-[28px] font-bold tracking-[-1px] text-ink">
            로그인
          </h1>
          <p className="text-sm text-secondary">
            평점을 남기려면 로그인이 필요해요.
          </p>
        </div>

        <TextField
          label="이메일"
          type="email"
          autoComplete="email"
          placeholder="movie@umc.com"
          value={form.email}
          onChange={(event) => handleChangeField("email", event.target.value)}
          errorMessage={showEmailError ? "이메일 형식이 올바르지 않아요." : null}
        />

        <TextField
          label="비밀번호"
          type="password"
          autoComplete="current-password"
          placeholder="비밀번호를 입력해 주세요"
          value={form.password}
          onChange={(event) => handleChangeField("password", event.target.value)}
        />

        <button
          type="submit"
          disabled={!canSubmit}
          className="mt-1 flex h-[50px] items-center justify-center rounded-[10px] bg-accent text-sm font-extrabold text-white disabled:bg-accent-disabled"
        >
          로그인
        </button>

        <p className="text-center text-xs text-secondary">
          아직 계정이 없으신가요?{" "}
          <Link to="/signup" className="font-bold text-accent">
            회원가입
          </Link>
        </p>
      </form>
    </main>
  );
}
