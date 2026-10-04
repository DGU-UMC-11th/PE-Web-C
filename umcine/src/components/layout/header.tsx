import { Link, useRouterState } from "@tanstack/react-router";

function Header() {
  const pathname = useRouterState({
    select: (state) => state.location.pathname,
  });

  const isMovieActive = pathname === "/" || pathname.startsWith("/movies/");

  const isSearchActive = pathname === "/search";

  const navBase =
    "cursor-pointer whitespace-nowrap text-[14px] font-bold leading-none no-underline max-[480px]:text-[12px]";

  const activeClass = "text-[#17191e] underline underline-offset-4";

  const inactiveClass = "text-[#606774]";

  return (
    <header className="box-border flex w-full items-center justify-between border-b border-[#e3e6eb] bg-white px-[max(80px,calc((100%-1280px)/2))] py-6 max-[480px]:px-4 max-[480px]:py-4">
      <div className="flex items-center gap-[42px] max-[480px]:gap-4">
        <div className="flex items-center gap-[10px] max-[480px]:gap-2">
          <img
            className="block h-8 w-8 max-[480px]:h-7 max-[480px]:w-7"
            src="/icons/movie.svg"
            alt=""
          />

          <span className="whitespace-nowrap text-[20px] font-black leading-none tracking-[-0.7px] text-[#17191e] max-[480px]:text-[16px]">
            UMCine
          </span>
        </div>

        <nav className="flex items-center gap-[30px] max-[480px]:gap-3">
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

      <div className="flex items-center gap-[10px] max-[480px]:gap-2">
        <button
          className="flex h-[42px] w-[42px] cursor-pointer items-center justify-center rounded-lg border border-[#e3e6eb] bg-white p-0 max-[480px]:h-9 max-[480px]:w-9"
          type="button"
          aria-label="검색"
        >
          <img
            className="h-6 w-6 max-[480px]:h-5 max-[480px]:w-5"
            src="/icons/search.svg"
            alt=""
          />
        </button>

        <button
          className="flex h-[42px] cursor-pointer items-center rounded-lg border border-white bg-[#2563eb] px-4 text-[14px] font-extrabold leading-none text-white max-[480px]:h-9 max-[480px]:px-3 max-[480px]:text-[12px]"
          type="button"
        >
          로그인
        </button>
      </div>
    </header>
  );
}

export { Header };
