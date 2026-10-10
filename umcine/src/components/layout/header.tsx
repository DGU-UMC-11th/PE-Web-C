import { Link } from "@tanstack/react-router";

// 활성 링크에는 TanStack Router가 data-status="active"와 aria-current="page"를 붙여 줘요.
const NAV_LINK_CLASS =
  "text-center text-sm font-bold text-text-secondary data-[status=active]:text-text-primary data-[status=active]:underline";

export function Header() {
  return (
    <header className="flex w-full items-center justify-between gap-4 border-b border-border-default bg-bg-surface px-4 py-4 sm:px-10 lg:px-20 lg:py-6">
      <div className="flex items-center gap-5 sm:gap-[42px]">
        <div className="flex items-center gap-2.5">
          <span className="flex size-8 items-center justify-center rounded-lg border-2 border-text-primary">
            <img src="/icons/movie.svg" alt="" width={24} height={24} />
          </span>
          <span className="hidden text-xl font-black tracking-[-0.7px] text-text-primary sm:inline">
            UMCine
          </span>
        </div>

        <nav className="flex items-center gap-4 sm:gap-[30px]" aria-label="주요 메뉴">
          <Link to="/" activeOptions={{ exact: true }} className={NAV_LINK_CLASS}>
            영화
          </Link>
          <Link to="/search" className={NAV_LINK_CLASS}>
            검색
          </Link>
          {/* 내 정보 화면은 아직 route가 없어서 링크 없이 메뉴 모양만 유지해요. */}
          <span className="text-center text-sm font-bold text-text-secondary">내 정보</span>
        </nav>
      </div>

      <div className="flex items-center gap-2.5">
        <Link
          to="/search"
          className="flex size-[42px] items-center justify-center rounded-lg border border-border-default bg-bg-surface"
          aria-label="영화 검색"
        >
          <img src="/icons/search.svg" alt="" width={24} height={24} />
        </Link>
        <button
          type="button"
          className="flex h-[42px] items-center justify-center rounded-lg border border-bg-surface bg-action-primary px-4 text-sm font-extrabold whitespace-nowrap text-bg-surface hover:bg-action-hover active:bg-action-pressed"
        >
          로그인
        </button>
      </div>
    </header>
  );
}
