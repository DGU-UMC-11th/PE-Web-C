import { Link, useRouterState } from "@tanstack/react-router";
import { cn } from "../../utils/cn";

export function Header() {
  const pathname = useRouterState({ select: (state) => state.location.pathname });
  const isMovieRoute = pathname === "/" || pathname.startsWith("/movies/");
  const menuClass = "text-sm font-bold text-[#656a73] transition-colors hover:text-[#191b20]";
  const activeClass = "text-[#191b20] underline decoration-1 underline-offset-4";

  return (
    <header className="shrink-0 border-b border-[#e8e9ed] bg-white">
      <div className="mx-auto flex min-h-[90px] w-[calc(100%_-_32px)] max-w-[1280px] flex-wrap items-center justify-between gap-y-3 py-4 min-[701px]:w-[calc(100%_-_160px)]">
        <div className="flex items-center gap-6 sm:gap-10">
          <Link to="/" aria-label="UMCine 홈" className="flex items-center gap-[9px] text-xl font-extrabold tracking-tight">
            <img className="size-8 rounded-[7px] border-2 border-[#191b20] p-px" src="/icons/movie.svg" alt="" />
            <span>UMCine</span>
          </Link>
          <nav aria-label="주 메뉴" className="flex items-center gap-4 sm:gap-8">
            <Link to="/" aria-current={isMovieRoute ? "page" : undefined} className={cn(menuClass, isMovieRoute && activeClass)}>영화</Link>
            <Link to="/search" search={{}} aria-current={pathname === "/search" ? "page" : undefined} className={cn(menuClass, pathname === "/search" && activeClass)}>검색</Link>
            <button type="button" disabled title="준비 중이에요." className="hidden text-sm font-bold text-[#656a73] sm:block">내 정보</button>
          </nav>
        </div>
        <div className="flex items-center gap-[10px]">
          <Link to="/search" search={{}} aria-label="영화 검색" className="flex size-[42px] items-center justify-center rounded-lg border border-[#dfe2e7] bg-white hover:bg-gray-50">
            <img className="size-5" src="/icons/search.svg" alt="" />
          </Link>
          <button type="button" disabled title="준비 중이에요." className="hidden h-[42px] rounded-lg bg-blue-600 px-4 text-sm font-bold text-white sm:block">로그인</button>
        </div>
      </div>
    </header>
  );
}
