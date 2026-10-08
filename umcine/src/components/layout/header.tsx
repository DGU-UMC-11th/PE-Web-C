import { Link } from "@tanstack/react-router";

const navLinkClass = "text-gray-500 hover:text-gray-900";
const activeNavLinkClass = "font-semibold text-gray-900 underline underline-offset-4";

export function Header() {
  return (
    <header className="border-b border-gray-200 bg-white">
      <div className="mx-auto flex h-16 max-w-6xl items-center justify-between px-6">
        <div className="flex items-center gap-8">
          <Link to="/" className="flex items-center gap-2 text-lg font-bold">
            UMCine
          </Link>
          <nav className="flex items-center gap-6 text-sm">
            <Link
              to="/"
              activeOptions={{ exact: true }}
              className={navLinkClass}
              activeProps={{ className: activeNavLinkClass }}
            >
              영화
            </Link>
            <Link
              to="/search"
              className={navLinkClass}
              activeProps={{ className: activeNavLinkClass }}
            >
              검색
            </Link>
            <span className={navLinkClass}>내 정보</span>
          </nav>
        </div>

        <div className="flex items-center gap-2">
          <Link
            to="/search"
            aria-label="검색"
            className="flex size-9 items-center justify-center rounded-md border border-gray-200 text-gray-600 hover:bg-gray-100"
          >
            <svg viewBox="0 0 24 24" className="size-4" fill="none" stroke="currentColor" strokeWidth="2">
              <circle cx="11" cy="11" r="7" />
              <path d="m20 20-3.5-3.5" />
            </svg>
          </Link>
          <button
            type="button"
            className="rounded-md bg-blue-600 px-4 py-2 text-sm font-semibold text-white hover:bg-blue-700"
          >
            로그인
          </button>
        </div>
      </div>
    </header>
  );
}