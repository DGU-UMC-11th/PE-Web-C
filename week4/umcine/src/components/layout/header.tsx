import { Link } from "@tanstack/react-router";
import { cn } from "../../utils/cn";

const navLinkClass = "text-[15px] font-medium text-gray-500 no-underline";
const navLinkActiveClass = cn(navLinkClass, "text-gray-900 font-bold");

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
          <a href="/me" className={navLinkClass}>
            내 정보
          </a>
        </nav>

        <div className="ml-auto flex items-center gap-4">
          <button
            type="button"
            className="flex h-6 w-6 items-center justify-center border-none bg-transparent p-0 cursor-pointer"
            aria-label="검색"
          >
            <img src="/icons/search.svg" alt="" className="h-5 w-5" />
          </button>
          <button
            type="button"
            className="cursor-pointer rounded-md border-none bg-blue-600 px-4 py-2 text-sm font-semibold text-white"
          >
            로그인
          </button>
        </div>
      </div>
    </header>
  );
}
