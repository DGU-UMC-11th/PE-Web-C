import { Link, useParams } from "@tanstack/react-router";
import { BookmarkButton } from "../../components/movies/bookmark-button";
import { movies } from "../../data/movies";

export function MovieDetailPage() {
  const { movieId } = useParams({ from: "/movies/$movieId" });
  const movie = movies.find((item) => item.id === Number(movieId));

  if (!movie) {
    return <main>영화를 찾을 수 없어요.</main>;
  }

  return (
    <main>
      <div className="relative h-[420px] w-full overflow-hidden">
        <img
          className="h-full w-full object-cover"
          src={movie.backdropPath}
          alt=""
          aria-hidden="true"
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
          <p className="mt-1 text-sm text-white/70">{movie.originalTitle}</p>
          <p className="mt-2 text-sm text-white/80">
            {movie.releaseDate} 개봉 · {movie.genres.join(" · ")} ·{" "}
            {movie.runtime}
          </p>
        </div>
      </div>

      <div className="mx-auto flex max-w-[1200px] gap-8 px-6 py-10">
        <img
          className="w-48 flex-shrink-0 rounded-lg"
          src={movie.posterPath}
          alt={`${movie.title} 포스터`}
        />
        <div>
          <h2 className="text-xl font-bold text-gray-900">
            {movie.tagline}
          </h2>
          <p className="mt-4 max-w-2xl leading-relaxed text-gray-700">
            {movie.overview}
          </p>
          <BookmarkButton movieId={movie.id} variant="text" className="mt-6" />
        </div>
      </div>
    </main>
  );
}
