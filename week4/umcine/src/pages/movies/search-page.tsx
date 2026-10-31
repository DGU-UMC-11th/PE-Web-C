import { Link, useNavigate, useSearch } from "@tanstack/react-router";
import { useState, type SubmitEvent } from "react";
import { movies } from "../../data/movies";
import { cn } from "../../utils/cn";

function SearchForm({ query }: { query: string }) {
  const navigate = useNavigate({ from: "/search" });
  const [searchText, setSearchText] = useState(query);
  const hasQuery = Boolean(query.trim());

  function handleSubmit(event: SubmitEvent<HTMLFormElement>) {
    event.preventDefault();
    const nextQuery = searchText.trim();
    void navigate({ search: nextQuery ? { query: nextQuery } : {} });
  }

  return (
    <form role="search" onSubmit={handleSubmit} className={cn(
      "flex w-full items-center gap-3 rounded-xl border bg-white px-4 sm:px-5",
      hasQuery ? "h-[54px] border-[#dfe2e7]" : "min-h-[74px] border-2 border-[#191b20] shadow-xl shadow-black/5",
    )}>
      <img className="size-6 shrink-0" src="/icons/search.svg" alt="" />
      <input type="search" aria-label="검색어" placeholder="예: 스파이더맨" value={searchText} onChange={(event) => setSearchText(event.target.value)} className={cn("min-w-0 flex-1 bg-transparent py-3 text-sm placeholder:text-[#9a9fa8] focus-visible:outline-none", hasQuery && "font-bold")} />
      {searchText && <button type="button" aria-label="검색어 지우기" onClick={() => setSearchText("")} className="flex size-8 shrink-0 items-center justify-center rounded-md hover:bg-gray-100"><img className="size-5" src="/icons/close.svg" alt="" /></button>}
      <button type="submit" className="h-[42px] shrink-0 rounded-lg bg-[#191b20] px-4 text-sm font-bold text-white hover:bg-[#30333a]">{hasQuery ? "다시 검색" : "검색"}</button>
    </form>
  );
}

export function SearchPage() {
  const { query } = useSearch({ from: "/search" });
  const searchQuery = query?.trim() ?? "";
  const normalizedQuery = searchQuery.toLocaleLowerCase();
  const searchResults = normalizedQuery ? movies.filter((movie) => movie.title.toLocaleLowerCase().includes(normalizedQuery) || movie.originalTitle.toLocaleLowerCase().includes(normalizedQuery)) : [];

  if (!normalizedQuery) {
    return (
      <main className="mx-auto w-[calc(100%_-_32px)] max-w-[1280px] flex-1 pt-24 pb-20 sm:pt-[205px] min-[701px]:w-[calc(100%_-_160px)]">
        <h1 className="mb-10 text-center text-3xl font-extrabold tracking-[-1.5px] sm:text-[44px]">어떤 영화를 찾고 있나요?</h1>
        <div className="mx-auto max-w-[790px]"><SearchForm key={query ?? ""} query="" /></div>
        <p className="mt-5 text-center text-sm text-[#656a73]">검색어를 입력해 주세요.</p>
      </main>
    );
  }

  return (
    <main className="mx-auto w-[calc(100%_-_32px)] max-w-[1280px] flex-1 pt-6 pb-12 min-[701px]:w-[calc(100%_-_160px)]">
      <h1 className="mb-5 text-[32px] leading-[44px] font-extrabold tracking-[-1.3px] sm:text-4xl">영화 검색</h1>
      <SearchForm key={query ?? ""} query={searchQuery} />
      <div aria-live="polite" className="mt-4 flex flex-wrap items-center justify-between gap-2 border-b border-[#dfe2e7] pb-4">
        <h2 className="break-all text-lg font-bold">‘{searchQuery}’ 검색 결과</h2>
        <p className="text-xs text-[#9a9fa8]">영화 {searchResults.length}편</p>
      </div>
      {searchResults.length === 0 ? (
        <div role="status" className="py-24 text-center">
          <p className="text-lg font-bold">검색 결과가 없어요.</p>
          <p className="mt-2 text-sm text-[#656a73]">다른 제목이나 원제로 검색해 보세요.</p>
        </div>
      ) : (
        <ul className="grid grid-cols-1 gap-x-10 lg:grid-cols-2">
          {searchResults.map((movie) => (
            <li key={movie.id} className="flex min-w-0 gap-4 border-b border-[#dfe2e7] py-5 sm:gap-[18px] sm:py-6">
              <Link to="/movies/$movieId" params={{ movieId: String(movie.id) }} className="shrink-0 overflow-hidden rounded-[10px] bg-gray-200">
                <img className="h-[150px] w-[100px] object-cover sm:h-[190px] sm:w-[126px]" src={movie.posterPath} alt={movie.title + " 포스터"} />
              </Link>
              <div className="flex min-w-0 flex-1 flex-col py-1">
                <h3 className="text-base leading-6 font-bold sm:text-lg"><Link to="/movies/$movieId" params={{ movieId: String(movie.id) }} className="hover:text-blue-600">{movie.title}</Link></h3>
                <p className="mt-2 flex flex-wrap gap-x-2 gap-y-1 text-xs text-[#9a9fa8]"><span>{movie.originalTitle}</span><span>{movie.releaseDate}</span></p>
                <p className="mt-3 text-xs leading-[1.8] text-[#656a73]">{movie.overview}</p>
                <Link to="/movies/$movieId" params={{ movieId: String(movie.id) }} className="mt-auto inline-flex w-fit items-center gap-1 pt-4 text-xs font-bold text-blue-600 hover:underline">상세 보기 <img className="size-4" src="/icons/arrow-right.svg" alt="" /></Link>
              </div>
            </li>
          ))}
        </ul>
      )}
    </main>
  );
}
