import { Link, useParams } from "@tanstack/react-router";
import { MovieRating } from "../../components/movies/movie-rating";
import { useMovieBookmarks } from "../../hooks/use-movie-bookmarks";
import { cn } from "../../utils/cn";

export function MovieDetailPage() {
  const { movieId } = useParams({ from: "/movies/$movieId" });
  const { movieList, toggleBookmark } = useMovieBookmarks();
  const movie = movieList.find((item) => String(item.id) === movieId);

  if (!movie) {
    return (
      <main className="flex flex-1 flex-col items-center justify-center gap-5 px-4 py-24">
        <h1 className="text-xl font-bold">영화를 찾을 수 없어요.</h1>
        <Link to="/" className="text-sm font-bold text-blue-600 hover:underline">영화 목록으로 돌아가기</Link>
      </main>
    );
  }

  return (
    <main className="flex-1">
      <section aria-labelledby="movie-title" className="relative isolate h-[360px] overflow-hidden bg-[#191b20] text-white">
        <img src={movie.backdropPath || movie.posterPath} alt="" aria-hidden="true" className="absolute inset-0 -z-20 size-full object-cover object-center" />
        <div aria-hidden="true" className="absolute inset-0 -z-10 bg-linear-to-r from-black/60 via-black/20 to-transparent" />
        <div aria-hidden="true" className="absolute inset-0 -z-10 bg-linear-to-t from-black/50 to-transparent" />
        <div className="mx-auto flex h-full w-[calc(100%_-_32px)] max-w-[1280px] flex-col justify-between py-6 min-[701px]:w-[calc(100%_-_160px)]">
          <Link to="/" className="inline-flex w-fit items-center gap-2 text-xs font-bold hover:underline"><img className="size-5 brightness-0 invert" src="/icons/chevron-left.svg" alt="" />영화 목록</Link>
          <div>
            <h1 id="movie-title" className="mb-2 text-[30px] leading-tight font-extrabold tracking-[-1.3px] sm:text-[44px]">{movie.title}</h1>
            <p className="mb-2 text-sm">{movie.originalTitle}</p>
            <div className="flex flex-wrap gap-x-2 gap-y-1 text-xs font-bold"><span>{movie.releaseDate}</span><span>{movie.genres.join(" · ")}</span><span>{movie.runtime}</span></div>
          </div>
        </div>
      </section>
      <div className="mx-auto grid w-[calc(100%_-_32px)] max-w-[1280px] gap-6 py-6 pb-12 min-[701px]:w-[calc(100%_-_160px)] lg:grid-cols-[minmax(0,1fr)_360px] lg:gap-[30px]">
        <section aria-labelledby="overview-title" className="flex min-w-0 items-start gap-5 sm:gap-8">
          <img className="aspect-[2/3] w-[100px] shrink-0 rounded-[10px] object-cover shadow-xl shadow-black/10 sm:w-[200px]" src={movie.posterPath} alt={movie.title + " 포스터"} />
          <div className="min-w-0">
            <h2 id="overview-title" className="mb-3 text-lg leading-[1.4] font-extrabold tracking-[-0.6px] sm:text-xl">{movie.tagline}</h2>
            <p className="text-sm leading-[1.85] text-[#656a73]">{movie.overview}</p>
            <button type="button" aria-pressed={movie.isBookmarked} onClick={() => toggleBookmark(movie.id)} className={cn("mt-4 inline-flex h-[42px] items-center gap-2 rounded-lg px-4 text-sm font-bold text-white transition-colors", movie.isBookmarked ? "bg-blue-700 hover:bg-blue-800" : "bg-blue-600 hover:bg-blue-700")}>
              <img className="size-[18px] brightness-0 invert" src={movie.isBookmarked ? "/icons/bookmark.svg" : "/icons/bookmark-outline.svg"} alt="" />{movie.isBookmarked ? "즐겨찾기 해제" : "즐겨찾기"}
            </button>
          </div>
        </section>
        <MovieRating key={movie.id} movieId={movie.id} />
      </div>
    </main>
  );
}
