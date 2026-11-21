import { Link, useNavigate, useRouterState } from "@tanstack/react-router";
import { useMyInfo } from "../../hooks/use-my-info";
import { useAuthStore } from "../../stores/auth-store";
import { cn } from "../../utils/cn";

export function Header() {
  const navigate = useNavigate();
  const profile = useMyInfo();

  function handleLogout() {
    useAuthStore.getState().signOut();
    void navigate({ to: "/login", replace: true });
  }

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
            <Link to="/mypage" aria-current={pathname.startsWith("/mypage") ? "page" : undefined} className={cn(menuClass, pathname.startsWith("/mypage") && activeClass)}>내 정보</Link>
          </nav>
        </div>
        <div className="flex items-center gap-[10px]">
          <Link to="/search" search={{}} aria-label="영화 검색" className="flex size-[42px] items-center justify-center rounded-lg border border-[#dfe2e7] bg-white hover:bg-gray-50">
            <img className="size-5" src="/icons/search.svg" alt="" />
          </Link>
          {profile.isLoggedIn ? <>
            {profile.isLoading ? (
              <span role="status" aria-label="내 정보 불러오는 중" className="h-[42px] w-24 animate-pulse rounded-lg bg-gray-200" />
            ) : (
              <Link to="/mypage" className="max-w-32 truncate text-sm font-bold">
                {profile.data ? `${profile.data.nickname}님` : "마이페이지"}
              </Link>
            )}
            <button type="button" onClick={handleLogout} className="h-[42px] rounded-lg border border-[#dfe2e7] px-4 text-sm font-bold hover:bg-gray-50">로그아웃</button>
          </> : <Link to="/login" className="flex h-[42px] items-center rounded-lg bg-blue-600 px-4 text-sm font-bold text-white hover:bg-blue-700">로그인</Link>}
        </div>
      </div>
    </header>
  );
}
