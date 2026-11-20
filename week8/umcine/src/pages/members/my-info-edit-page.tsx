import { Link } from "@tanstack/react-router";
import { useState, type SubmitEvent } from "react";
import { TextField } from "../../components/form/text-field";
import type { MemberInfo } from "../../api/members/me";
import { useMeQuery } from "../../hooks/use-me-query";
import { useUpdateMeMutation } from "../../hooks/use-update-me-mutation";
import { isValidNickname } from "../../utils/members/validation";

export function MyInfoEditPage() {
  const meQuery = useMeQuery();

  return (
    <main className="mx-auto max-w-md px-6 pt-10 pb-20">
      <h1 className="text-2xl font-bold">내 정보 수정</h1>
      <p className="mt-2 text-sm text-gray-500">닉네임을 바꿀 수 있어요.</p>

      {meQuery.isPending ? (
        <p className="mt-8 text-sm text-gray-500">내 정보를 불러오는 중이에요.</p>
      ) : meQuery.isError ? (
        <p className="mt-8 text-sm text-red-600">내 정보를 불러오지 못했어요.</p>
      ) : (
        <EditForm me={meQuery.data} />
      )}
    </main>
  );
}

function EditForm({ me }: { me: MemberInfo }) {
  const [nickname, setNickname] = useState(me.nickname);
  const updateMeMutation = useUpdateMeMutation();

  const trimmedNickname = nickname.trim();
  const isNicknameValid = isValidNickname(nickname);
  const showNicknameError = nickname.length > 0 && !isNicknameValid;
  const isChanged = trimmedNickname !== me.nickname;
  const canSubmit = isNicknameValid && isChanged;

  function handleSubmit(event: SubmitEvent<HTMLFormElement>) {
    event.preventDefault();
    if (!canSubmit || updateMeMutation.isPending) return;

    updateMeMutation.mutate({ nickname: trimmedNickname });
  }

  return (
    <form onSubmit={handleSubmit} noValidate className="mt-8 flex flex-col gap-6">
      {/* 이메일은 바꿀 수 없어서 읽기 전용으로 보여줘요. */}
      <TextField label="이메일" type="email" value={me.email} readOnly disabled />

      <TextField
        label="닉네임"
        type="text"
        autoComplete="nickname"
        placeholder="2~12자로 입력해 주세요"
        value={nickname}
        disabled={updateMeMutation.isPending}
        onChange={(event) => setNickname(event.target.value)}
        errorMessage={
          showNicknameError ? "닉네임은 2자 이상 12자 이하로 입력해 주세요." : null
        }
      />

      <div className="mt-2 flex gap-3">
        <Link
          to="/me"
          className="flex-1 rounded-md border border-gray-300 bg-white px-4 py-3 text-center text-sm font-semibold text-gray-900 no-underline"
        >
          취소
        </Link>
        <button
          type="submit"
          disabled={!canSubmit || updateMeMutation.isPending}
          className="flex-1 cursor-pointer rounded-md border-none bg-blue-600 px-4 py-3 text-sm font-semibold text-white disabled:cursor-not-allowed disabled:bg-gray-400"
        >
          {updateMeMutation.isPending ? "저장 중" : "저장하기"}
        </button>
      </div>
    </form>
  );
}
