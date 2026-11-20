import { Link, useParams } from "@tanstack/react-router";
import { useQuery } from "@tanstack/react-query";
import { movieQueries } from "../../api/movies/queries";
import { ErrorState } from "../../components/common/async-state";
import { FavoriteButton } from "../../components/movies/favorite-button";
import { useFavoriteStatusQuery } from "../../hooks/use-favorites";
import { MyRatingPanel } from "../../components/movies/my-rating-panel";
import { MoviePoster } from "../../components/movies/movie-poster";
import {
  formatReleaseDate,
  formatRuntime,
} from "../../utils/movies/format-movie";
import { getMovieDetailErrorMessage } from "../../utils/movies/get-movie-detail-error-message";
import {
  getTmdbBackdropUrl,
  getTmdbPosterUrl,
} from "../../utils/movies/tmdb-image";

export function MovieDetailPage() {
  const { movieId } = useParams({ from: "/movies/$movieId" });
  const parsedMovieId = Number(movieId);
  const isValidMovieId = Number.isInteger(parsedMovieId) && parsedMovieId > 0;

  // 유효하지 않은 영화 번호면 요청 자체를 하지 않아요(enabled: false).
  const movieDetailQuery = useQuery(movieQueries.detail(parsedMovieId));
  // 상세 화면에서는 이 영화 하나만 확인하면 되므로 단건 조회 API를 써요.
  const favoriteStatusQuery = useFavoriteStatusQuery(parsedMovieId, isValidMovieId);

  // enabled가 false면 요청을 안 해도 isPending이 참이라,
  // 잘못된 번호 안내를 로딩보다 먼저 처리해요.
  if (!isValidMovieId) {
    return (
      <main className="mx-auto flex w-full max-w-[1440px] flex-1 flex-col items-center justify-center bg-page px-4 sm:px-6 lg:px-20">
        <ErrorState message="올바르지 않은 영화 번호예요." />
        <Link to="/" className="text-sm font-bold text-accent">
          영화 목록으로 돌아가기
        </Link>
      </main>
    );
  }

  if (movieDetailQuery.isPending) {
    return (
      <main
        className="mx-auto flex max-w-[1440px] flex-1 items-center justify-center bg-page px-4 py-24 text-center text-muted sm:px-6 lg:px-20"
        aria-busy="true"
      >
        영화 정보를 불러오는 중이에요.
      </main>
    );
  }

  if (movieDetailQuery.isError) {
    return (
      <main className="mx-auto flex w-full max-w-[1440px] flex-1 flex-col items-center justify-center bg-page px-4 sm:px-6 lg:px-20">
        {/* 404와 그 밖의 오류를 구분해 안내해요. */}
        <ErrorState
          message={getMovieDetailErrorMessage(movieDetailQuery.error)}
          onRetry={() => movieDetailQuery.refetch()}
        />
        <Link to="/" className="text-sm font-bold text-accent">
          영화 목록으로 돌아가기
        </Link>
      </main>
    );
  }

  const movie = movieDetailQuery.data;
  const backdropUrl = getTmdbBackdropUrl(movie.backdrop_path);
  const posterUrl = getTmdbPosterUrl(movie.poster_path);
  const genreNames = movie.genres.map((genre) => genre.name).join(", ");

  return (
    <main className="flex flex-1 flex-col bg-page">
      <div className="relative h-[220px] w-full overflow-hidden sm:h-[300px] lg:h-[360px]">
        {backdropUrl ? (
          <img
            src={backdropUrl}
            alt=""
            aria-hidden="true"
            className="h-full w-full object-cover"
          />
        ) : (
          <div className="grid h-full w-full place-items-center bg-ink/80 text-sm text-white/70">
            이미지 없음
          </div>
        )}

        <div className="absolute inset-0 flex flex-col justify-between bg-gradient-to-t from-ink/80 to-transparent px-4 py-4 sm:px-6 sm:py-6 lg:px-20">
          <Link
            to="/"
            className="flex items-center gap-1 self-start text-[13px] font-bold text-white"
          >
            <span
              className="icon size-6 text-white [--icon-url:url('/icons/chevron-left.svg')]"
              aria-hidden="true"
            />
            영화 목록
          </Link>

          <div className="flex w-full max-w-[800px] flex-col gap-2">
            <h1 className="text-2xl font-bold tracking-[-1.2px] text-white sm:text-[46px] sm:leading-[49.68px] sm:tracking-[-2.3px]">
              {movie.title}
            </h1>
            <p className="text-sm text-white">{movie.original_title}</p>
            <div className="flex flex-wrap items-center gap-2 text-[13px] font-bold text-white">
              <span>{formatReleaseDate(movie.release_date)}</span>
              {genreNames && <span>{genreNames}</span>}
              <span>{formatRuntime(movie.runtime)}</span>
            </div>
          </div>
        </div>
      </div>

      <div className="mx-auto flex w-full max-w-[1440px] flex-col gap-8 px-4 py-6 sm:px-6 lg:flex-row lg:px-20">
        <MoviePoster
          src={posterUrl}
          alt={`${movie.title} 포스터`}
          className="h-[286px] w-[200px] shrink-0 self-center rounded-[10px] shadow-[0px_12px_30px_rgba(12,15,20,0.12)] lg:self-start"
        />

        <div className="flex flex-1 flex-col gap-3">
          {movie.tagline && (
            <h2 className="text-[21px] font-bold tracking-[-0.63px] text-ink">
              {movie.tagline}
            </h2>
          )}
          <p className="leading-6 text-secondary">
            {movie.overview || "줄거리 정보가 없어요."}
          </p>

          <div>
            <FavoriteButton
              movieId={movie.id}
              movieTitle={movie.title}
              variant="label"
              isFavorite={favoriteStatusQuery.data}
            />
          </div>
        </div>

        <MyRatingPanel movieId={movie.id} />
      </div>
    </main>
  );
}
