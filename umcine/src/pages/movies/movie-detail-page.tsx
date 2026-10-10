import { Link, useParams } from "@tanstack/react-router";
import { movies } from "../../data/movies";

export function MovieDetailPage() {
  const { movieId } = useParams({ from: "/movies/$movieId" });
  const movie = movies.find((item) => item.id === Number(movieId));

  if (!movie) {
    return (
      <main className="flex w-full flex-1 flex-col items-start gap-3 px-4 py-6 sm:px-10 lg:px-20">
        <p>영화를 찾을 수 없어요.</p>
        <Link to="/" className="text-sm font-bold text-action-primary hover:underline">
          영화 목록으로 돌아가기
        </Link>
      </main>
    );
  }

  return (
    <main className="flex w-full flex-1 flex-col">
      <div className="relative overflow-hidden">
        {/* 장식용 배경 이미지: 스크린 리더가 같은 정보를 반복해서 읽지 않도록 alt를 비워요. */}
        <img
          className="absolute inset-0 size-full object-cover"
          src={movie.backdropPath}
          alt=""
          aria-hidden="true"
        />
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
            <img
              className="aspect-[2/3] w-40 shrink-0 rounded-[10px] object-cover shadow-lg sm:w-[220px]"
              src={movie.posterPath}
              alt={`${movie.title} 포스터`}
            />
            <div className="flex flex-col gap-2">
              <h1 className="text-[30px] leading-tight font-bold tracking-[-1.2px] sm:text-[38px] sm:leading-[44px] sm:tracking-[-1.71px]">
                {movie.title}
              </h1>
              <p className="text-sm text-white/80">{movie.originalTitle}</p>
              <div className="flex flex-wrap gap-x-3 gap-y-1 text-sm text-white/80">
                <p>{movie.releaseDate}</p>
                <p>{movie.genres.join(" · ")}</p>
                <p>{movie.runtime}</p>
              </div>
            </div>
          </div>
        </div>
      </div>

      <section className="flex flex-col gap-3 px-4 py-8 sm:px-10 lg:px-20">
        <h2 className="text-xl font-bold">{movie.tagline}</h2>
        <p className="max-w-3xl text-base leading-7 text-text-secondary">{movie.overview}</p>
      </section>
    </main>
  );
}
