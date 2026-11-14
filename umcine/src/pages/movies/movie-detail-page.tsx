import { Link, useParams } from "@tanstack/react-router";
import { useQuery } from "@tanstack/react-query";
import { movieDetailQuery } from "../../api/movies/movie-queries";
import { BookmarkButton } from "../../components/movies/bookmark-button";
import { MoviePoster } from "../../components/movies/movie-poster";
import { formatReleaseDate, formatRuntime } from "../../utils/movies/format-movie";
import { getMovieDetailErrorMessage } from "../../utils/movies/get-movie-detail-error-message";
import { getTmdbBackdropUrl } from "../../utils/movies/tmdb-image";

function DetailMessage({ children }: { children: React.ReactNode }) {
  return (
    <main className="flex w-full flex-1 flex-col items-start gap-3 px-4 py-6 sm:px-10 lg:px-20">
      <p role="status">{children}</p>
      <Link to="/" className="text-sm font-bold text-action-primary hover:underline">
        영화 목록으로 돌아가기
      </Link>
    </main>
  );
}

export function MovieDetailPage() {
  const { movieId } = useParams({ from: "/movies/$movieId" });
  const parsedMovieId = Number(movieId);
  const isValidMovieId = Number.isInteger(parsedMovieId) && parsedMovieId > 0;

  // 5주차의 useEffect + DetailResult state를 useQuery로 바꿨어요.
  // 영화 ID가 queryKey에 들어가므로 영화마다 캐시가 따로 생기고, 같은 영화를 다시 열면 캐시를 먼저 보여 줘요.
  const detailQuery = useQuery(movieDetailQuery(parsedMovieId));

  const movie = detailQuery.data;

  if (!isValidMovieId) {
    return <DetailMessage>올바르지 않은 영화 번호예요.</DetailMessage>;
  }

  // enabled가 false(잘못된 번호)여도 isPending은 참일 수 있어요. 그래서 잘못된 번호 안내를 로딩보다 먼저 처리했어요.
  if (detailQuery.isPending) {
    return (
      <main className="flex w-full flex-1 flex-col" aria-busy="true">
        <div className="flex animate-pulse flex-col gap-6 bg-text-primary/80 px-4 py-8 sm:flex-row sm:items-end sm:px-10 lg:px-20 lg:py-12">
          <div className="aspect-[2/3] w-40 rounded-[10px] bg-white/20 sm:w-[220px]" />
          <div className="flex flex-col gap-3">
            <div className="h-9 w-64 rounded bg-white/20" />
            <div className="h-4 w-40 rounded bg-white/20" />
          </div>
        </div>
        <p className="sr-only" role="status">
          영화 정보를 불러오는 중이에요.
        </p>
      </main>
    );
  }

  if (detailQuery.isError) {
    // 404면 "영화를 찾을 수 없어요.", 그 밖의 실패는 "영화 정보를 불러오지 못했어요."
    return <DetailMessage>{getMovieDetailErrorMessage(detailQuery.error)}</DetailMessage>;
  }

  if (!movie) {
    return <DetailMessage>영화 정보를 불러오지 못했어요.</DetailMessage>;
  }

  const backdropUrl = getTmdbBackdropUrl(movie.backdrop_path);
  const genreNames = movie.genres.map((genre) => genre.name).join(", ");

  return (
    <main className="flex w-full flex-1 flex-col">
      <div className="relative overflow-hidden bg-text-tertiary">
        {/* 장식용 배경 이미지: 스크린 리더가 같은 정보를 반복해서 읽지 않도록 alt를 비워요. */}
        {backdropUrl ? (
          <img
            className="absolute inset-0 size-full object-cover"
            src={backdropUrl}
            alt=""
            aria-hidden="true"
          />
        ) : (
          <span className="absolute right-4 bottom-3 text-xs font-bold text-white/70">
            이미지 없음
          </span>
        )}
        <div className="absolute inset-0 bg-black/60" />

        <div className="relative flex flex-col gap-6 px-4 py-8 text-white sm:px-10 lg:px-20 lg:py-12">
          <Link
            to="/"
            className="inline-flex w-fit items-center gap-1 text-sm font-bold hover:underline"
          >
            <img
              className="brightness-0 invert"
              src="/icons/chevron-left.svg"
              alt=""
              width={20}
              height={20}
            />
            영화 목록
          </Link>

          <div className="flex flex-col gap-6 sm:flex-row sm:items-end">
            <MoviePoster
              posterPath={movie.poster_path}
              title={movie.title}
              className="aspect-[2/3] w-40 shrink-0 rounded-[10px] shadow-lg sm:w-[220px]"
            />
            <div className="flex flex-col gap-2">
              <div className="flex items-center gap-3">
                <h1 className="text-[30px] leading-tight font-bold tracking-[-1.2px] sm:text-[38px] sm:leading-[44px] sm:tracking-[-1.71px]">
                  {movie.title}
                </h1>
                <BookmarkButton movieId={movie.id} title={movie.title} />
              </div>
              <p className="text-sm text-white/80">{movie.original_title}</p>
              <div className="flex flex-wrap gap-x-3 gap-y-1 text-sm text-white/80">
                <p>{formatReleaseDate(movie.release_date)}</p>
                {genreNames && <p>{genreNames}</p>}
                <p>{formatRuntime(movie.runtime)}</p>
              </div>
            </div>
          </div>
        </div>
      </div>

      <section className="flex flex-col gap-3 px-4 py-8 sm:px-10 lg:px-20">
        {movie.tagline && <h2 className="text-xl font-bold">{movie.tagline}</h2>}
        <p className="max-w-3xl text-base leading-7 text-text-secondary">
          {movie.overview || "줄거리 정보가 없어요."}
        </p>
      </section>
    </main>
  );
}
