import { useQuery } from "@tanstack/react-query";
import { Link, useNavigate } from "@tanstack/react-router";
import { useEffect, useState, type FormEvent } from "react";

import { getMe } from "../../api/members/me";
import { useUpdateMeMutation } from "../../hooks/use-update-me-mutation";
import { useAuthStore } from "../../stores/auth-store";

export function MyEditPage() {
  const navigate = useNavigate();

  const accessToken = useAuthStore((state) => state.accessToken);
  const updateMeMutation = useUpdateMeMutation();

  const meQuery = useQuery({
    queryKey: ["members", "me"],
    queryFn: getMe,
    enabled: Boolean(accessToken),
    staleTime: 5 * 60 * 1000,
    retry: false,
  });

  const [nickname, setNickname] = useState("");

  useEffect(() => {
    if (meQuery.data) {
      setNickname(meQuery.data.nickname);
    }
  }, [meQuery.data]);

  const nicknameValue = nickname.trim();

  const isNicknameValid =
    nicknameValue.length >= 2 && nicknameValue.length <= 12;

  const canSave =
    isNicknameValid &&
    !updateMeMutation.isPending &&
    !meQuery.isLoading &&
    Boolean(meQuery.data);

  const handleSubmit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    if (!canSave) return;

    updateMeMutation.mutate(
      { nickname: nicknameValue },
      {
        onSuccess: () => {
          navigate({ to: "/my" });
        },
      },
    );
  };

  const inputClassName =
    "w-full rounded-lg border border-[#d5dae2] px-4 py-3 text-sm outline-none focus:border-[#2563eb] disabled:bg-[#f8fafc]";

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
              value={meQuery.data?.email ?? ""}
              readOnly
              className={`${inputClassName} bg-[#f8fafc]`}
            />

            <p className="mt-2 text-xs text-[#606774]">
              이메일은 변경할 수 없습니다.
            </p>
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
              disabled={!meQuery.data || updateMeMutation.isPending}
              className={inputClassName}
            />

            {nickname.length > 0 && !isNicknameValid && (
              <p className="mt-2 text-xs text-red-500">
                닉네임은 2~12자로 입력해 주세요.
              </p>
            )}
          </div>

          {meQuery.isLoading && (
            <p className="text-sm text-[#606774]">
              회원 정보를 불러오는 중입니다.
            </p>
          )}

          {meQuery.isError && (
            <p role="alert" className="text-sm text-red-500">
              회원 정보를 불러오지 못했습니다.
            </p>
          )}

          <button
            type="submit"
            disabled={!canSave}
            className="w-full rounded-lg bg-[#2563eb] py-3 font-bold text-white disabled:cursor-not-allowed disabled:opacity-50"
          >
            {updateMeMutation.isPending ? "저장 중" : "저장하기"}
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
