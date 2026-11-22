import { useQuery } from "@tanstack/react-query";
import { Link } from "@tanstack/react-router";

import { getMe } from "../../api/members/me";
import { useAuthStore } from "../../stores/auth-store";

export function MyPage() {
  const accessToken = useAuthStore((state) => state.accessToken);

  const meQuery = useQuery({
    queryKey: ["members", "me"],
    queryFn: getMe,
    enabled: Boolean(accessToken),
    staleTime: 5 * 60 * 1000,
    retry: false,
  });

  const myInfo = meQuery.data;

  return (
    <main className="min-h-[calc(100vh-91px)] bg-[#f8fafc] px-5 py-16">
      <div className="mx-auto w-full max-w-[440px] rounded-2xl border border-[#e3e6eb] bg-white p-8 shadow-sm">
        <h1 className="mb-2 text-center text-[28px] font-extrabold text-[#17191e]">
          내 정보
        </h1>

        <p className="mb-8 text-center text-sm text-[#606774]">
          UMCine에서 사용하는 내 정보를 확인해 보세요.
        </p>

        {!accessToken ? (
          <div className="space-y-4 text-center">
            <p className="text-sm text-[#606774]">로그인이 필요합니다.</p>

            <Link
              to="/login"
              className="block w-full rounded-lg bg-[#2563eb] py-3 text-center font-bold text-white"
            >
              로그인하러 가기
            </Link>
          </div>
        ) : meQuery.isLoading ? (
          <p className="text-center text-sm text-[#606774]">
            회원 정보를 불러오는 중입니다.
          </p>
        ) : meQuery.isError || !myInfo ? (
          <p role="alert" className="text-center text-sm text-red-500">
            회원 정보를 불러오지 못했습니다.
          </p>
        ) : (
          <div className="space-y-5">
            <div>
              <p className="mb-2 text-sm font-bold text-[#17191e]">이메일</p>

              <div className="rounded-lg border border-[#d5dae2] bg-[#f8fafc] px-4 py-3 text-sm">
                {myInfo.email}
              </div>
            </div>

            <div>
              <p className="mb-2 text-sm font-bold text-[#17191e]">닉네임</p>

              <div className="rounded-lg border border-[#d5dae2] bg-[#f8fafc] px-4 py-3 text-sm">
                {myInfo.nickname}
              </div>
            </div>

            <Link
              to="/my/edit"
              className="block w-full rounded-lg bg-[#2563eb] py-3 text-center font-bold text-white"
            >
              내 정보 수정
            </Link>
          </div>
        )}
      </div>
    </main>
  );
}
