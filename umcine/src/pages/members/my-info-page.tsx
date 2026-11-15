import { useQueries } from "@tanstack/react-query";
import { Link } from "@tanstack/react-router";
import { useState } from "react";
import { movieDetailQuery } from "../../api/movies/movie-queries";
import type { TmdbMovieListItem } from "../../api/movies/models";
import { PRIMARY_BUTTON_CLASS } from "../../components/form/form-field";
import { MovieGrid, MovieGridSkeleton } from "../../components/movies/movie-grid";
import { Pagination } from "../../components/movies/pagination";
import { StatusMessage } from "../../components/movies/status-message";
import { useBookmarkStore } from "../../stores/bookmark-store";
import { useProfileStore } from "../../stores/profile-store";

const PAGE_SIZE = 5;

// 7주차 필수 미션: 내 정보 조회 화면. 기본 정보(닉네임·이메일)와 내 즐겨찾기(4주차 북마크)를 보여 줘요.
// 기본 정보는 8주차에 GET /members/me 응답으로 바꿔요.
export function MyInfoPage() {
  const profile = useProfileStore((state) => state.profile);
  const bookmarkedIds = useBookmarkStore((state) => state.bookmarkedIds);
  const [page, setPage] = useState(1);

  // 북마크한 영화 ID마다 상세 query 하나씩. 6주차 캐시 덕분에 상세 화면에서 본 영화는 요청 없이 바로 나와요.
  const totalPages = Math.max(1, Math.ceil(bookmarkedIds.length / PAGE_SIZE));
  const currentPage = Math.min(page, totalPages);
  const pageIds = bookmarkedIds.slice((currentPage - 1) * PAGE_SIZE, currentPage * PAGE_SIZE);
  const bookmarkQueries = useQueries({ queries: pageIds.map((id) => movieDetailQuery(id)) });
  const isLoading = bookmarkQueries.some((query) => query.isPending);
  const movies: TmdbMovieListItem[] = bookmarkQueries.flatMap((query) =>
    query.data ? [{ ...query.data, genre_ids: query.data.genres.map((genre) => genre.id) }] : [],
  );

  return (
    <main className="flex w-full flex-1 flex-col gap-8 px-4 py-6 sm:px-10 lg:px-20">
      <div className="flex items-start justify-between gap-4">
        <h1 className="text-[38px] leading-[44px] font-bold tracking-[-1.71px] text-text-primary">내 정보</h1>
        <Link to="/me/edit" className={PRIMARY_BUTTON_CLASS}>
          정보 수정
        </Link>
      </div>

      <section className="flex flex-col gap-3" aria-labelledby="basic-info">
        <h2 id="basic-info" className="text-base font-bold text-text-primary">
          기본 정보
        </h2>
        {profile ? (
          <div className="flex flex-col gap-6 rounded-[10px] border border-border-default bg-bg-surface p-5 sm:flex-row sm:items-center sm:gap-10">
            <span className="flex size-12 shrink-0 items-center justify-center rounded-full bg-bg-page">
              <img src="/icons/person.svg" alt="" width={24} height={24} />
            </span>
            <dl className="grid flex-1 grid-cols-1 gap-4 sm:grid-cols-2">
              <div className="flex flex-col gap-1">
                <dt className="text-xs text-text-tertiary">닉네임</dt>
                <dd className="text-sm font-bold text-text-primary">{profile.nickname}</dd>
              </div>
              <div className="flex flex-col gap-1">
                <dt className="text-xs text-text-tertiary">이메일</dt>
                <dd className="text-sm font-bold text-text-primary">{profile.email}</dd>
              </div>
            </dl>
          </div>
        ) : (
          <div className="flex flex-col items-start gap-3 rounded-[10px] border border-border-default bg-bg-surface p-5">
            <StatusMessage>로그인하면 기본 정보를 볼 수 있어요.</StatusMessage>
            <Link to="/login" className="text-sm font-bold text-action-primary hover:underline">
              로그인하러 가기
            </Link>
          </div>
        )}
      </section>

      <section className="flex flex-col gap-5" aria-labelledby="my-bookmarks">
        <h2 id="my-bookmarks" className="text-base font-bold text-text-primary">
          내 즐겨찾기
        </h2>
        {bookmarkedIds.length === 0 ? (
          <StatusMessage>아직 즐겨찾기한 영화가 없어요. 영화 카드의 북마크 버튼을 눌러 보세요.</StatusMessage>
        ) : isLoading ? (
          <MovieGridSkeleton count={pageIds.length} />
        ) : (
          <>
            <MovieGrid movies={movies} />
            <Pagination currentPage={currentPage} totalPages={totalPages} onPageChange={setPage} />
          </>
        )}
      </section>
    </main>
  );
}
