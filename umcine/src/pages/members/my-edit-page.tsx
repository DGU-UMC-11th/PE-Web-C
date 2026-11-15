import { useState, type SubmitEvent } from "react";

// 서버 연동 전 임시 데이터
const TEMP_PROFILE = {
  nickname: "mini0722",
  email: "llltop11@naver.com",
};

const LABEL_CLASS = "text-xs font-semibold text-gray-900";
const INPUT_CLASS =
  "w-full rounded-lg border border-gray-200 bg-white px-3 py-3 text-sm outline-none focus:border-blue-600";

export function MyEditPage() {
  const [nickname, setNickname] = useState(TEMP_PROFILE.nickname);

  const handleSubmit = (e: SubmitEvent<HTMLFormElement>) => {
    // 폼 제출 시 페이지 새로고침 방지
    e.preventDefault();

    // 정보 수정 API 요청은 이후 단계에서 추가
  };

  return (
    <main className="mx-auto flex min-h-[720px] max-w-6xl flex-col px-6 py-10">
      <form onSubmit={handleSubmit} noValidate>
        <div className="flex items-start justify-between gap-4">
          <div>
            <h1 className="text-3xl font-bold">내 정보 수정</h1>
            <p className="mt-2 text-xs text-gray-500">
              닉네임과 프로필 이미지만 변경할 수 있어요.
            </p>
          </div>
          <button
            type="submit"
            className="h-9 shrink-0 self-start rounded-lg bg-blue-600 px-4 text-xs font-semibold text-white hover:bg-blue-700"
          >
            변경사항 저장
          </button>
        </div>

        <div className="mt-10 grid gap-10 md:grid-cols-2">
          <div className="flex flex-col items-center gap-2">
            <div className="relative size-20">
              <div className="flex size-20 items-center justify-center rounded-full bg-gray-200">
                <svg
                  viewBox="0 0 24 24"
                  className="size-8 text-gray-900"
                  fill="currentColor"
                >
                  <circle cx="12" cy="8" r="4" />
                  <path d="M4 21c0-4.4 3.6-7 8-7s8 2.6 8 7z" />
                </svg>
              </div>
              {/* 이미지 업로드는 모양만 만들어요 */}
              <button
                type="button"
                aria-label="프로필 이미지 변경"
                className="absolute bottom-0 right-0 flex size-6 items-center justify-center rounded-full border border-gray-300 bg-white"
              >
                <svg
                  viewBox="0 0 24 24"
                  className="size-3"
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
                value={TEMP_PROFILE.email}
                readOnly
                className={`${INPUT_CLASS} text-gray-600`}
              />
            </div>
          </div>
        </div>
      </form>

      <section className="mt-auto flex items-center justify-between gap-4 rounded-lg border border-[#f3c1c1] bg-[#fdecec] px-5 py-4">
        <div>
          <h2 className="text-xs font-bold text-[#dc2626]">회원 탈퇴</h2>
          <p className="mt-1 text-[11px] text-[#ef4444]">
            탈퇴하면 작성한 평점, 후기와 즐겨찾기가 모두 삭제되며 복구할 수
            없습니다.
          </p>
        </div>
        <button
          type="button"
          className="h-9 shrink-0 rounded-lg border border-[#ef4444] bg-white px-4 text-xs font-semibold text-[#dc2626] hover:bg-[#fff5f5]"
        >
          회원 탈퇴
        </button>
      </section>
    </main>
  );
}
