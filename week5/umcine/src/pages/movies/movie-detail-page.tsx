import { Link, useParams } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { getMovieDetail } from "../../api/movies/get-movie-detail";
import type { TmdbMovieDetail } from "../../api/movies/models";
import { BookmarkButton } from "../../components/movies/bookmark-button";
import { MovieImage } from "../../components/movies/movie-image";
import { formatRuntime } from "../../utils/movies/format-runtime";
import { getMovieDetailErrorMessage } from "../../utils/movies/get-movie-detail-error-message";
import {
  getTmdbBackdropUrl,
  getTmdbPosterUrl,
} from "../../utils/movies/tmdb-image";

export function MovieDetailPage() {
  const { movieId } = useParams({ from: "/movies/$movieId" });
  const parsedMovieId = Number(movieId);
  const isValidMovieId = Number.isInteger(parsedMovieId) && parsedMovieId > 0;

  const [movie, setMovie] = useState<TmdbMovieDetail | null>(null);
  const [isLoading, setIsLoading] = useState(isValidMovieId);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  useEffect(() => {
    let ignore = false;

    setMovie(null);
    setErrorMessage(null);

    if (!isValidMovieId) {
      setIsLoading(false);
      return;
    }

    async function loadMovie() {
      setIsLoading(true);

      try {
        const response = await getMovieDetail(parsedMovieId);
        if (!ignore) setMovie(response);
      } catch (error) {
        if (!ignore) setErrorMessage(getMovieDetailErrorMessage(error));
      } finally {
        if (!ignore) setIsLoading(false);
      }
    }

    loadMovie();

    return () => {
      ignore = true;
    };
  }, [parsedMovieId, isValidMovieId]);

  if (!isValidMovieId) {
    return <main className="p-10">올바르지 않은 영화 번호예요.</main>;
  }

  if (isLoading) {
    return <main className="p-10">영화 정보를 불러오는 중이에요.</main>;
  }

  if (errorMessage || !movie) {
    return <main className="p-10 text-red-600">{errorMessage}</main>;
  }

  return (
    <main>
      <div className="relative h-[420px] w-full overflow-hidden">
        <MovieImage
          className="h-full w-full object-cover"
          src={getTmdbBackdropUrl(movie.backdrop_path)}
          alt=""
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/20 to-transparent" />
        <Link
          to="/"
          className="absolute top-6 left-6 text-sm font-medium text-white no-underline"
        >
          &larr; 영화 목록
        </Link>
        <div className="absolute right-0 bottom-8 left-0 mx-auto max-w-[1200px] px-6 text-white">
          <h1 className="text-3xl font-bold">{movie.title}</h1>
          <p className="mt-1 text-sm text-white/70">{movie.original_title}</p>
          <p className="mt-2 text-sm text-white/80">
            {movie.release_date} 개봉 ·{" "}
            {movie.genres.map((genre) => genre.name).join(", ")} ·{" "}
            {formatRuntime(movie.runtime)}
          </p>
        </div>
      </div>

      <div className="mx-auto flex max-w-[1200px] gap-8 px-6 py-10">
        <MovieImage
          className="aspect-[2/3] w-48 flex-shrink-0 rounded-lg"
          src={getTmdbPosterUrl(movie.poster_path)}
          alt={`${movie.title} 포스터`}
        />
        <div>
          <h2 className="text-xl font-bold text-gray-900">{movie.tagline}</h2>
          <p className="mt-4 max-w-2xl leading-relaxed text-gray-700">
            {movie.overview}
          </p>
          <BookmarkButton movieId={movie.id} variant="text" className="mt-6" />
        </div>
      </div>
    </main>
  );
}
