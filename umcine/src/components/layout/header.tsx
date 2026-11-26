import { useQuery } from "@tanstack/react-query";
import { Link, useRouterState } from "@tanstack/react-router";

import { getMe } from "../../api/members/me";
import { useAuthStore } from "../../stores/auth-store";

function Header() {
  const pathname = useRouterState({
    select: (state) => state.location.pathname,
  });

  const accessToken = useAuthStore((state) => state.accessToken);

  const meQuery = useQuery({
    queryKey: ["members", "me"],
    queryFn: getMe,
    enabled: Boolean(accessToken),
    staleTime: 5 * 60 * 1000,
    retry: false,
  });

  const isMovieActive = pathname === "/" || pathname.startsWith("/movies/");

  const isSearchActive = pathname === "/search";

  const navBase =
    "cursor-pointer whitespace-nowrap text-[14px] font-bold leading-none no-underline max-[768px]:text-[12px]";

  const activeClass = "text-[#17191e] underline underline-offset-4";

  const inactiveClass = "text-[#606774]";

  const authButtonClass =
    "flex h-[42px] shrink-0 cursor-pointer items-center justify-center whitespace-nowrap rounded-lg border border-white bg-[#2563eb] px-4 text-[14px] font-extrabold leading-none text-white max-[768px]:h-9 max-[768px]:px-3 max-[768px]:text-[12px]";

  return (
    <header className="box-border flex w-full items-center justify-between border-b border-[#e3e6eb] bg-white px-20 py-6 max-[768px]:px-5 max-[768px]:py-4">
      <div className="flex items-center gap-[42px] max-[768px]:gap-4">
        <div className="flex items-center gap-[10px] max-[768px]:gap-2">
          <img
            className="block h-8 w-8 max-[768px]:h-7 max-[768px]:w-7"
            src="/icons/movie.svg"
            alt=""
          />

          <span className="whitespace-nowrap text-[20px] font-black leading-none tracking-[-0.7px] text-[#17191e] max-[768px]:text-[16px]">
            UMCine
          </span>
        </div>

        <nav className="flex items-center gap-[30px] max-[768px]:gap-3">
          <Link
            to="/"
            className={`${navBase} ${
              isMovieActive ? activeClass : inactiveClass
            }`}
          >
            영화
          </Link>

          <Link
            to="/search"
            className={`${navBase} ${
              isSearchActive ? activeClass : inactiveClass
            }`}
          >
            검색
          </Link>

          <span className={`${navBase} ${inactiveClass}`}>내 정보</span>
        </nav>
      </div>

      <div className="flex items-center gap-[10px] max-[768px]:gap-2">
        <Link
          to="/search"
          aria-label="검색"
          className="flex h-[42px] w-[42px] shrink-0 items-center justify-center rounded-lg border border-[#e3e6eb] bg-white max-[768px]:h-9 max-[768px]:w-9"
        >
          <img
            className="h-6 w-6 max-[768px]:h-5 max-[768px]:w-5"
            src="/icons/search.svg"
            alt=""
          />
        </Link>

        {!accessToken ? (
          <Link to="/login" className={authButtonClass}>
            로그인
          </Link>
        ) : meQuery.isLoading ? (
          <span
            role="status"
            aria-label="회원 정보 불러오는 중"
            className="h-[42px] w-[100px] animate-pulse rounded-lg bg-gray-200 max-[768px]:h-9 max-[768px]:w-[80px]"
          />
        ) : (
          <Link to="/my" className={authButtonClass}>
            마이페이지
          </Link>
        )}
      </div>
    </header>
  );
}

export { Header };
