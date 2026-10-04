import { Link } from "@tanstack/react-router";

function Header() {
  return (
    <header className="box-border flex w-full items-center justify-between border-b border-[#e3e6eb] bg-white px-[max(80px,calc((100%-1280px)/2))] py-6 max-[480px]:px-5 max-[480px]:py-4">
      <div className="flex items-center gap-[42px]">
        <div className="flex items-center gap-[10px]">
          <img className="block h-8 w-8" src="/icons/movie.svg" alt="" />

          <span className="text-[20px] font-black leading-none tracking-[-0.7px] text-[#17191e]">
            UMCine
          </span>
        </div>

        <nav className="flex items-center gap-[30px] text-[14px] font-bold leading-none text-[#606774]">
          <Link
            to="/"
            className="cursor-pointer text-[#17191e] underline underline-offset-4"
          >
            영화
          </Link>

          <Link to="/search" className="cursor-pointer">
            검색
          </Link>

          <span className="cursor-pointer">내 정보</span>
        </nav>
      </div>

      <div className="flex items-center gap-[10px]">
        <button
          className="flex h-[42px] w-[42px] cursor-pointer items-center justify-center rounded-lg border border-[#e3e6eb] bg-white p-0"
          type="button"
          aria-label="검색"
        >
          <img className="h-6 w-6" src="/icons/search.svg" alt="" />
        </button>

        <button
          className="flex h-[42px] cursor-pointer items-center rounded-lg border border-white bg-[#2563eb] px-4 text-[14px] font-extrabold leading-none text-white"
          type="button"
        >
          로그인
        </button>
      </div>
    </header>
  );
}

export { Header };
