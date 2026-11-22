import { useState, type FormEvent } from "react";
import { Link } from "@tanstack/react-router";

import { useLoginMutation } from "../../hooks/use-login-mutation";

const EMAIL_REGEX = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

export function LoginPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const loginMutation = useLoginMutation();

  const canSubmit = EMAIL_REGEX.test(email.trim()) && password.length > 0;

  const handleSubmit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    if (!canSubmit || loginMutation.isPending) return;

    loginMutation.mutate({
      email: email.trim(),
      password,
    });
  };

  return (
    <main className="min-h-[calc(100vh-91px)] bg-[#f8fafc] px-5 py-16">
      <div className="mx-auto w-full max-w-[440px] rounded-2xl border border-[#e3e6eb] bg-white p-8 shadow-sm">
        <h1 className="mb-2 text-center text-[28px] font-extrabold text-[#17191e]">
          로그인
        </h1>

        <p className="mb-8 text-center text-sm text-[#606774]">
          UMCine에 오신 것을 환영합니다.
        </p>

        <form onSubmit={handleSubmit} className="space-y-5">
          <div>
            <label
              htmlFor="login-email"
              className="mb-2 block text-sm font-bold text-[#17191e]"
            >
              이메일
            </label>

            <input
              id="login-email"
              type="email"
              value={email}
              onChange={(event) => setEmail(event.target.value)}
              placeholder="이메일을 입력해 주세요."
              autoComplete="email"
              disabled={loginMutation.isPending}
              className="w-full rounded-lg border border-[#d5dae2] px-4 py-3 text-sm outline-none focus:border-[#2563eb] disabled:bg-[#f8fafc]"
            />
          </div>

          <div>
            <label
              htmlFor="login-password"
              className="mb-2 block text-sm font-bold text-[#17191e]"
            >
              비밀번호
            </label>

            <input
              id="login-password"
              type="password"
              value={password}
              onChange={(event) => setPassword(event.target.value)}
              placeholder="비밀번호를 입력해 주세요."
              autoComplete="current-password"
              disabled={loginMutation.isPending}
              className="w-full rounded-lg border border-[#d5dae2] px-4 py-3 text-sm outline-none focus:border-[#2563eb] disabled:bg-[#f8fafc]"
            />
          </div>

          <button
            type="submit"
            disabled={!canSubmit || loginMutation.isPending}
            className="w-full cursor-pointer rounded-lg bg-[#2563eb] py-3 font-bold text-white disabled:cursor-not-allowed disabled:opacity-50"
          >
            {loginMutation.isPending ? "로그인 중" : "로그인"}
          </button>
        </form>

        <p className="mt-6 text-center text-sm text-[#606774]">
          아직 계정이 없으신가요?{" "}
          <Link to="/signup" className="font-bold text-[#2563eb]">
            회원가입
          </Link>
        </p>
      </div>
    </main>
  );
}
