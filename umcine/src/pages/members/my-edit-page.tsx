import { useEffect, useState, type SubmitEvent } from "react";
import { useQuery } from "@tanstack/react-query";
import { getMe } from "../../api/members/me";
import { useUpdateMeMutation } from "../../hooks/use-update-me-mutation";
import { useAuthStore } from "../../stores/auth-store";

const LABEL_CLASS = "text-xs font-semibold text-gray-900";
const INPUT_CLASS =
  "w-full rounded-lg border border-gray-200 bg-white px-3 py-3 text-sm outline-none focus:border-blue-600";

export function MyEditPage() {
  const accessToken = useAuthStore((state) => state.accessToken);
  const meQuery = useQuery({
    queryKey: ["members", "me"],
    queryFn: getMe,
    enabled: Boolean(accessToken),
    staleTime: 5 * 60 * 1000,
    retry: false,
  });
  const updateMeMutation = useUpdateMeMutation();

  const [nickname, setNickname] = useState("");

  // 내 정보가 도착하면 입력창 초기값으로 채움
  useEffect(() => {
    if (meQuery.data) setNickname(meQuery.data.nickname);
  }, [meQuery.data]);

  const trimmedNickname = nickname.trim();
  const canSubmit = trimmedNickname.length >= 2 && trimmedNickname.length <= 12;

  const handleSubmit = (e: SubmitEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (!canSubmit || updateMeMutation.isPending) return;

    updateMeMutation.mutate({ nickname: trimmedNickname });
  };

  if (!accessToken) {
    return (
      <main className="mx-auto max-w-6xl px-6 py-16 text-center text-sm text-gray-500">
        로그인이 필요해요.
      </main>
    );
  }

  return (
    <main
      className="mx-auto max-w-6xl px-6 py-10"
      style={{ display: "flex", flexDirection: "column", minHeight: 720 }}
    >
      <form onSubmit={handleSubmit} noValidate>
        <div
          style={{
            display: "flex",
            alignItems: "flex-start",
            justifyContent: "space-between",
            gap: 16,
          }}
        >
          <div>
            <h1 className="text-3xl font-bold">내 정보 수정</h1>
            <p className="mt-2 text-xs text-gray-500">
              닉네임과 프로필 이미지만 변경할 수 있어요.
            </p>
          </div>
          <button
            type="submit"
            disabled={!canSubmit || updateMeMutation.isPending}
            className="bg-blue-600 text-white hover:bg-blue-700 disabled:cursor-not-allowed disabled:bg-blue-300"
            style={{
              height: 36,
              padding: "0 16px",
              borderRadius: 8,
              fontSize: 12,
              fontWeight: 600,
              flexShrink: 0,
              alignSelf: "flex-start",
            }}
          >
            {updateMeMutation.isPending ? "저장 중" : "변경사항 저장"}
          </button>
        </div>

        <div className="mt-10 grid gap-10 md:grid-cols-2">
          <div
            style={{
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
              gap: 8,
            }}
          >
            <div style={{ position: "relative", width: 80, height: 80 }}>
              <div
                className="bg-gray-200"
                style={{
                  width: 80,
                  height: 80,
                  borderRadius: "50%",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                }}
              >
                <svg
                  viewBox="0 0 24 24"
                  width="32"
                  height="32"
                  fill="currentColor"
                  className="text-gray-900"
                >
                  <circle cx="12" cy="8" r="4" />
                  <path d="M4 21c0-4.4 3.6-7 8-7s8 2.6 8 7z" />
                </svg>
              </div>
              <button
                type="button"
                aria-label="프로필 이미지 변경"
                style={{
                  position: "absolute",
                  right: 0,
                  bottom: 0,
                  width: 24,
                  height: 24,
                  borderRadius: "50%",
                  border: "1px solid #d1d5db",
                  background: "#fff",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  padding: 0,
                }}
              >
                <svg
                  viewBox="0 0 24 24"
                  width="12"
                  height="12"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                >
                  <path d="M12 20h9" />
                  <path d="M16.5 3.5a2.1 2.1 0 0 1 3 3L7 19l-4 1 1-4z" />
                </svg>
              </button>
            </div>
            <p className="text-sm font-bold">프로필 이미지</p>
            <p className="text-[11px] text-gray-400">선택 사항 · 최대 5MB</p>
          </div>

          <div className="flex flex-col gap-5">
            <div className="flex flex-col gap-1.5">
              <label htmlFor="nickname" className={LABEL_CLASS}>
                닉네임
              </label>
              <div className="relative">
                <input
                  id="nickname"
                  type="text"
                  value={nickname}
                  onChange={(e) => setNickname(e.target.value)}
                  className={`${INPUT_CLASS} pr-20`}
                />
                <button
                  type="button"
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-xs font-semibold text-blue-600 hover:underline"
                >
                  중복 확인
                </button>
              </div>
            </div>

            <div className="flex flex-col gap-1.5">
              <label htmlFor="email" className={LABEL_CLASS}>
                이메일
              </label>
              <input
                id="email"
                type="email"
                value={meQuery.data?.email ?? ""}
                readOnly
                className={`${INPUT_CLASS} text-gray-600`}
              />
            </div>
          </div>
        </div>
      </form>

      <section
        style={{
          marginTop: "auto",
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          gap: 16,
          padding: "16px 20px",
          border: "1px solid #f3c1c1",
          background: "#fdecec",
          borderRadius: 8,
        }}
      >
        <div>
          <h2 style={{ fontSize: 12, fontWeight: 700, color: "#dc2626" }}>
            회원 탈퇴
          </h2>
          <p style={{ marginTop: 4, fontSize: 11, color: "#ef4444" }}>
            탈퇴하면 작성한 평점, 후기와 즐겨찾기가 모두 삭제되며 복구할 수
            없습니다.
          </p>
        </div>
        <button
          type="button"
          style={{
            height: 36,
            padding: "0 16px",
            borderRadius: 8,
            border: "1px solid #ef4444",
            background: "#fff",
            color: "#dc2626",
            fontSize: 12,
            fontWeight: 600,
            flexShrink: 0,
          }}
        >
          회원 탈퇴
        </button>
      </section>
    </main>
  );
}
