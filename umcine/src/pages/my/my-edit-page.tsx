import { Link, useNavigate } from "@tanstack/react-router";
import { useState, type FormEvent } from "react";

interface MyInfo {
  email: string;
  nickname: string;
}

const defaultInfo: MyInfo = {
  email: "weektest@example.com",
  nickname: "week7tester",
};

function getInitialInfo(): MyInfo {
  const savedInfo = localStorage.getItem("umcine-my-info");

  if (!savedInfo) return defaultInfo;

  try {
    const parsedInfo = JSON.parse(savedInfo) as MyInfo;

    if (
      typeof parsedInfo.email === "string" &&
      typeof parsedInfo.nickname === "string"
    ) {
      return parsedInfo;
    }
  } catch {
    return defaultInfo;
  }

  return defaultInfo;
}

export function MyEditPage() {
  const navigate = useNavigate();

  const [initialInfo] = useState(getInitialInfo);
  const [email, setEmail] = useState(initialInfo.email);
  const [nickname, setNickname] = useState(initialInfo.nickname);

  const isEmailValid = /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email.trim());

  const isNicknameValid =
    nickname.trim().length >= 2 && nickname.trim().length <= 12;

  const canSave = isEmailValid && isNicknameValid;

  const handleSubmit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    if (!canSave) return;

    const updatedInfo: MyInfo = {
      email: email.trim(),
      nickname: nickname.trim(),
    };

    localStorage.setItem("umcine-my-info", JSON.stringify(updatedInfo));

    navigate({ to: "/my" });
  };

  return (
    <main className="min-h-[calc(100vh-91px)] bg-[#f8fafc] px-5 py-16">
      <div className="mx-auto w-full max-w-[440px] rounded-2xl border border-[#e3e6eb] bg-white p-8 shadow-sm">
        <h1 className="mb-2 text-center text-[28px] font-extrabold text-[#17191e]">
          내 정보 수정
        </h1>

        <p className="mb-8 text-center text-sm text-[#606774]">
          UMCine에서 사용할 정보를 수정해 보세요.
        </p>

        <form className="space-y-5" onSubmit={handleSubmit}>
          <div>
            <label
              htmlFor="email"
              className="mb-2 block text-sm font-bold text-[#17191e]"
            >
              이메일
            </label>

            <input
              id="email"
              type="email"
              value={email}
              onChange={(event) => setEmail(event.target.value)}
              className="w-full rounded-lg border border-[#d5dae2] px-4 py-3 text-sm outline-none focus:border-[#2563eb]"
            />

            {email.length > 0 && !isEmailValid && (
              <p className="mt-2 text-xs text-red-500">
                올바른 이메일 형식으로 입력해 주세요.
              </p>
            )}
          </div>

          <div>
            <label
              htmlFor="nickname"
              className="mb-2 block text-sm font-bold text-[#17191e]"
            >
              닉네임
            </label>

            <input
              id="nickname"
              type="text"
              value={nickname}
              onChange={(event) => setNickname(event.target.value)}
              className="w-full rounded-lg border border-[#d5dae2] px-4 py-3 text-sm outline-none focus:border-[#2563eb]"
            />

            {nickname.length > 0 && !isNicknameValid && (
              <p className="mt-2 text-xs text-red-500">
                닉네임은 2~12자로 입력해 주세요.
              </p>
            )}
          </div>

          <button
            type="submit"
            disabled={!canSave}
            className="w-full rounded-lg bg-[#2563eb] py-3 font-bold text-white disabled:cursor-not-allowed disabled:opacity-50"
          >
            저장하기
          </button>

          <Link
            to="/my"
            className="block w-full rounded-lg border border-[#d5dae2] py-3 text-center font-bold text-[#606774]"
          >
            취소
          </Link>
        </form>
      </div>
    </main>
  );
}
