import { useState, type FormEvent } from "react";
import { Link, useNavigate } from "@tanstack/react-router";
import { TextField } from "../../components/form/text-field";
import { useMeQuery } from "../../hooks/use-me-query";
import { useUpdateMeMutation } from "../../hooks/use-update-me-mutation";

export function MyInfoEditPage() {
  const navigate = useNavigate();
  const meQuery = useMeQuery();
  const updateMeMutation = useUpdateMeMutation();

  // 조회가 끝난 뒤 한 번만 초기값을 잡으려고 key로 리마운트시켜요.
  const [nickname, setNickname] = useState(meQuery.data?.nickname ?? "");

  const trimmedNickname = nickname.trim();
  const isNicknameValid =
    trimmedNickname.length >= 2 && trimmedNickname.length <= 12;
  const showNicknameError = nickname.length > 0 && !isNicknameValid;
  const isUnchanged = trimmedNickname === meQuery.data?.nickname;

  const canSubmit = isNicknameValid && !isUnchanged;

  const handleSubmit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (!canSubmit || updateMeMutation.isPending) return;

    updateMeMutation.mutate(
      { nickname: trimmedNickname },
      { onSuccess: () => navigate({ to: "/me" }) },
    );
  };

  return (
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
      <TextField
        label="이메일"
        type="email"
        value={meQuery.data?.email ?? ""}
        disabled
        readOnly
      />

      <TextField
        label="닉네임"
        type="text"
        autoComplete="nickname"
        placeholder="2~12자"
        value={nickname}
        onChange={(event) => setNickname(event.target.value)}
        errorMessage={
          showNicknameError ? "닉네임은 2자 이상 12자 이하로 입력해 주세요." : null
        }
      />

      <button
        type="submit"
        disabled={!canSubmit || updateMeMutation.isPending}
        className="mt-1 flex h-[50px] items-center justify-center rounded-[10px] bg-accent text-sm font-extrabold text-white disabled:bg-accent-disabled"
      >
        {updateMeMutation.isPending ? "저장 중" : "저장"}
      </button>

      <Link to="/me" className="text-center text-xs font-bold text-secondary">
        취소하고 돌아가기
      </Link>
    </form>
  );
}
