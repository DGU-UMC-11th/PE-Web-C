import { Link, useLocation } from "@tanstack/react-router";
import { cn } from "../../utils/cn";

const NAV_ITEMS = [
  { label: "영화", to: "/" },
  { label: "검색", to: "/search" },
] as const;

export default function Header() {
  const location = useLocation();

  return (
    <header className="sticky top-0 z-10 border-b border-border bg-surface">
      <div className="mx-auto flex max-w-[1440px] items-center justify-between gap-4 px-4 py-4 sm:px-6 lg:px-20 lg:py-6">
        <div className="flex items-center gap-6 lg:gap-[42px]">
          <Link to="/" className="flex items-center gap-2.5">
            <span className="flex size-8 items-center justify-center rounded-lg border-2 border-ink">
              <span
                className="icon size-6 text-ink [--icon-url:url('/icons/movie.svg')]"
                aria-hidden="true"
              />
            </span>
            <span className="text-xl font-black tracking-[-0.7px] text-ink">
              UMCine
            </span>
          </Link>

          <nav aria-label="주요 메뉴">
            <ul className="flex items-center gap-5 lg:gap-[30px]">
              {NAV_ITEMS.map(({ label, to }) => {
                const isActive = location.pathname === to;

                return (
                  <li key={to}>
                    <Link
                      to={to}
                      aria-current={isActive ? "page" : undefined}
                      className={cn(
                        "text-sm font-bold text-secondary",
                        isActive && "text-ink underline",
                      )}
                    >
                      {label}
                    </Link>
                  </li>
                );
              })}
            </ul>
          </nav>
        </div>

        <div className="flex items-center gap-2.5">
          <Link
            to="/search"
            aria-label="검색"
            className="flex size-[42px] items-center justify-center rounded-lg border border-border bg-surface"
          >
            <span
              className="icon size-6 text-ink [--icon-url:url('/icons/search.svg')]"
              aria-hidden="true"
            />
          </Link>

          <button
            type="button"
            className="flex h-[42px] items-center justify-center rounded-lg border border-white bg-accent px-4 text-sm font-extrabold text-white"
          >
            로그인
          </button>
        </div>
      </div>
    </header>
  );
}
