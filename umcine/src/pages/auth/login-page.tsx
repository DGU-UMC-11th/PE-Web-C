import { useState, type SubmitEvent } from "react";
import { Link } from "@tanstack/react-router";

const DEFAULT_FORM = { email: "", password: "" };

const LABEL_CLASS = "text-xs font-semibold text-gray-900";
const INPUT_WRAP_CLASS =
  "flex items-center gap-2 rounded-lg border border-gray-200 bg-white px-3 py-3 focus-within:border-blue-600";
const INPUT_CLASS =
  "w-full bg-transparent text-sm outline-none placeholder:text-gray-400";

function MailIcon() {
  return (
    <svg
      viewBox="0 0 24 24"
      className="size-4 shrink-0 text-gray-500"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
    >
      <rect x="3" y="5" width="18" height="14" rx="2" />
      <path d="m3 7 9 6 9-6" />
    </svg>
  );
}

function LockIcon() {
  return (
    <svg
      viewBox="0 0 24 24"
      className="size-4 shrink-0 text-gray-500"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
    >
      <rect x="5" y="11" width="14" height="9" rx="2" />
      <path d="M8 11V8a4 4 0 0 1 8 0v3" />
    </svg>
  );
}

export function LoginPage() {
  const [form, setForm] = useState(DEFAULT_FORM);

  const canSubmit = form.email.trim().length > 0 && form.password.length > 0;

  const handleChangeField = (key: keyof typeof DEFAULT_FORM, value: string) => {
    setForm((prev) => ({ ...prev, [key]: value }));
  };

  const handleSubmit = (e: SubmitEvent<HTMLFormElement>) => {
    // 폼 제출 시 페이지 새로고침 방지
    e.preventDefault();

    // 로그인 API 요청은 이후 단계에서 추가
  };

  return (
    <main className="mx-auto w-full max-w-[430px] px-6 py-24">
      <form onSubmit={handleSubmit} noValidate className="flex flex-col gap-4">
        <h1 className="text-3xl font-bold">로그인</h1>

        <div className="flex flex-col gap-1.5">
          <label htmlFor="email" className={LABEL_CLASS}>
            이메일
          </label>
          <div className={INPUT_WRAP_CLASS}>
            <MailIcon />
            <input
              id="email"
              type="email"
              value={form.email}
              onChange={(e) => handleChangeField("email", e.target.value)}
              placeholder="name@example.com"
              className={INPUT_CLASS}
            />
          </div>
        </div>

        <div className="flex flex-col gap-1.5">
          <label htmlFor="password" className={LABEL_CLASS}>
            비밀번호
          </label>
          <div className={INPUT_WRAP_CLASS}>
            <LockIcon />
            <input
              id="password"
              type="password"
              value={form.password}
              onChange={(e) => handleChangeField("password", e.target.value)}
              placeholder="비밀번호"
              className={INPUT_CLASS}
            />
          </div>
        </div>

        <button
          type="submit"
          disabled={!canSubmit}
          className="mt-2 w-full rounded-lg bg-blue-600 py-3 text-sm font-semibold text-white hover:bg-blue-700 disabled:cursor-not-allowed disabled:bg-blue-300"
        >
          로그인
        </button>

        <p className="text-center text-xs text-gray-500">
          처음이신가요?{" "}
          <Link to="/signup" className="font-semibold text-blue-600">
            회원가입
          </Link>
        </p>
      </form>
    </main>
  );
}
