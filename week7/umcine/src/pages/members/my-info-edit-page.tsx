import { useState, type FormEvent } from "react";
import { Link, useNavigate } from "@tanstack/react-router";
import { TextField } from "../../components/form/text-field";
import { useProfileStore } from "../../stores/profile-store";

/**
 * 내 정보 수정 화면이에요.
 * PATCH /members/me 연동은 8주차에서 붙이고, 지금은 입력값이 화면에 반영되는 것까지만 확인해요.
 */
export function MyInfoEditPage() {
  const navigate = useNavigate();

  const email = useProfileStore((state) => state.email);
  const currentNickname = useProfileStore((state) => state.nickname);
  const updateNickname = useProfileStore((state) => state.updateNickname);

  const [nickname, setNickname] = useState(currentNickname);

  const trimmedNickname = nickname.trim();
  const isNicknameValid =
    trimmedNickname.length >= 2 && trimmedNickname.length <= 12;
  const showNicknameError = nickname.length > 0 && !isNicknameValid;
  const isUnchanged = trimmedNickname === currentNickname;

  const handleSubmit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (!isNicknameValid || isUnchanged) return;

    updateNickname(trimmedNickname);
    navigate({ to: "/me" });
  };

  return (
    <main className="mx-auto flex w-full max-w-[1440px] flex-1 justify-center px-4 py-12 sm:px-6 lg:px-20">
      <form
        onSubmit={handleSubmit}
        noValidate
        className="flex w-full max-w-[460px] flex-col gap-5 rounded-2xl border border-border bg-surface p-7"
      >
        <div className="flex flex-col gap-1.5">
          <h1 className="text-[28px] font-bold tracking-[-1px] text-ink">
            내 정보 수정
          </h1>
          <p className="text-sm text-secondary">닉네임만 변경할 수 있어요.</p>
        </div>

        {/* 이메일은 바꿀 수 없는 값이라 읽기 전용으로 보여줘요 */}
        <TextField label="이메일" type="email" value={email} disabled readOnly />

        <TextField
          label="닉네임"
          type="text"
          autoComplete="nickname"
          placeholder="2~12자"
          value={nickname}
          onChange={(event) => setNickname(event.target.value)}
          errorMessage={
            showNicknameError
              ? "닉네임은 2자 이상 12자 이하로 입력해 주세요."
              : null
          }
        />

        <button
          type="submit"
          disabled={!isNicknameValid || isUnchanged}
          className="mt-1 flex h-[50px] items-center justify-center rounded-[10px] bg-accent text-sm font-extrabold text-white disabled:bg-accent-disabled"
        >
          저장하기
        </button>

        <Link
          to="/me"
          className="text-center text-xs font-bold text-secondary"
        >
          취소하고 돌아가기
        </Link>
      </form>
    </main>
  );
}
