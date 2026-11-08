import { Link } from "@tanstack/react-router";
import type { TmdbMovieListItem } from "../../api/movies/models";
import { formatReleaseDate } from "../../utils/movies/format-movie";
import { BookmarkButton } from "./bookmark-button";
import { MoviePoster } from "./movie-poster";

interface MovieCardProps {
  movie: TmdbMovieListItem;
}

export function MovieCard({ movie }: MovieCardProps) {
  const { id, title, release_date, poster_path } = movie;

  return (
    <article className="relative flex flex-col gap-1">
      {/* 포스터와 제목을 하나의 Link로 감싸 카드에서 상세 화면으로 이동해요. */}
      <Link
        to="/movies/$movieId"
        params={{ movieId: String(id) }}
        className="group flex flex-col gap-1"
      >
        <div className="h-[274px] overflow-hidden rounded-[10px] bg-bg-page">
          <MoviePoster posterPath={poster_path} title={title} className="size-full" />
        </div>
        <div className="overflow-hidden pt-[5px] text-sm font-extrabold text-text-primary group-hover:underline">
          {title}
        </div>
      </Link>
      <div className="text-xs text-text-tertiary">{formatReleaseDate(release_date)}</div>

      {/* 버튼을 Link 밖에 두어 링크 안에 버튼이 중첩되지 않게 해요. */}
      <BookmarkButton movieId={id} title={title} className="absolute top-2.5 right-2.5" />
    </article>
  );
}
