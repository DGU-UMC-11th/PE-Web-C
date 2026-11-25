import { useQueryClient } from "@tanstack/react-query";
import { Link, useNavigate } from "@tanstack/react-router";
import { useMeQuery } from "../../hooks/use-me-query";
import { useAuthStore } from "../../stores/auth-store";
import { cn } from "../../utils/cn";

const navLinkClass = "text-[15px] font-medium text-gray-500 no-underline";
const navLinkActiveClass = cn(navLinkClass, "text-gray-900 font-bold");
const outlineButtonClass =
  "rounded-md border border-gray-300 bg-white px-4 py-2 text-sm font-semibold text-gray-900 no-underline cursor-pointer";

export function Header() {
  return (
    <header className="border-b border-gray-200 bg-white">
      <div className="mx-auto flex max-w-[1200px] items-center gap-10 px-6 py-4">
        <Link
          to="/"
          className="flex items-center gap-1.5 text-xl font-bold text-gray-900 no-underline"
        >
          <img src="/icons/movie.svg" alt="" className="h-6 w-6" />
          <span>UMCine</span>
        </Link>

        <nav className="flex items-center gap-6">
          <Link
            to="/"
            className={navLinkClass}
            activeProps={{ className: navLinkActiveClass }}
            activeOptions={{ exact: true }}
          >
            영화
          </Link>
          <Link
            to="/search"
            className={navLinkClass}
            activeProps={{ className: navLinkActiveClass }}
          >
            검색
          </Link>
        </nav>

        <div className="ml-auto flex items-center gap-4">
          <button
            type="button"
            className="flex h-6 w-6 items-center justify-center border-none bg-transparent p-0 cursor-pointer"
            aria-label="검색"
          >
            <img src="/icons/search.svg" alt="" className="h-5 w-5" />
          </button>
          <AuthArea />
        </div>
      </div>
    </header>
  );
}

function AuthArea() {
  const accessToken = useAuthStore((state) => state.accessToken);
  const setAccessToken = useAuthStore((state) => state.setAccessToken);
  const queryClient = useQueryClient();
  const navigate = useNavigate();
  // 토큰의 유효성은 내 정보 API가 확인해요. 401이면 토큰이 비워져 로그인 링크로 바뀌어요.
  const meQuery = useMeQuery();

  function handleLogout() {
    setAccessToken(null);
    // 다른 계정으로 로그인했을 때 이전 회원의 데이터가 보이지 않도록 지워요.
    queryClient.removeQueries({ queryKey: ["members"] });
    queryClient.removeQueries({ queryKey: ["favorites"] });
    navigate({ to: "/" });
  }

  if (!accessToken) {
    return (
      <>
        <Link to="/login" className={outlineButtonClass}>
          로그인
        </Link>
        <Link
          to="/signup"
          className="rounded-md bg-blue-600 px-4 py-2 text-sm font-semibold text-white no-underline"
        >
          회원가입
        </Link>
      </>
    );
  }

  if (meQuery.isLoading) {
    return (
      <span
        aria-label="내 정보를 불러오는 중"
        className="h-10 w-24 animate-pulse rounded-lg bg-gray-200"
      />
    );
  }

  return (
    <>
      <Link
        to="/me"
        className="rounded-md bg-blue-600 px-4 py-2 text-sm font-semibold text-white no-underline"
      >
        {meQuery.data ? `${meQuery.data.nickname}님의 마이페이지` : "마이페이지"}
      </Link>
      <button type="button" onClick={handleLogout} className={outlineButtonClass}>
        로그아웃
      </button>
    </>
  );
}
