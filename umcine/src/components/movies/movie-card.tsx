import { Link } from "@tanstack/react-router";
import type { Movie } from "../../types/movie";
import { BookmarkButton } from "./bookmark-button";

interface MovieCardProps {
  movie: Movie;
}

export function MovieCard({ movie }: MovieCardProps) {
  const { id, title, releaseDate, posterPath } = movie;

  return (
    <article className="relative flex flex-col gap-1">
      {/* 포스터와 제목을 하나의 Link로 감싸 카드에서 상세 화면으로 이동해요. */}
      <Link
        to="/movies/$movieId"
        params={{ movieId: String(id) }}
        className="group flex flex-col gap-1"
      >
        <div className="h-[274px] overflow-hidden rounded-[10px] bg-bg-page">
          <img className="size-full object-cover" src={posterPath} alt={`${title} 포스터`} />
        </div>
        <div className="overflow-hidden pt-[5px] text-sm font-extrabold text-text-primary group-hover:underline">
          {title}
        </div>
      </Link>
      <div className="text-xs text-text-tertiary">{releaseDate}</div>

      {/* 버튼을 Link 밖에 두어 링크 안에 버튼이 중첩되지 않게 해요. */}
      <BookmarkButton movieId={id} title={title} className="absolute top-2.5 right-2.5" />
    </article>
  );
}
