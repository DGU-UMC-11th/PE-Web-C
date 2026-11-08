import { cn } from "../../utils/cn";
import { getTmdbPosterUrl } from "../../utils/movies/tmdb-image";

interface MoviePosterProps {
  posterPath: string | null;
  title: string;
  className?: string;
}

// 포스터 URL이 있을 때만 <img>를 그리고, 없으면 같은 크기의 회색 영역에 "이미지 없음"을 표시해요.
// (null이나 빈 문자열을 src에 그대로 넣지 않아요.)
export function MoviePoster({ posterPath, title, className }: MoviePosterProps) {
  const posterUrl = getTmdbPosterUrl(posterPath);

  if (!posterUrl) {
    return (
      <div
        role="img"
        aria-label={`${title} 포스터 없음`}
        className={cn(
          "flex items-center justify-center bg-border-default text-xs font-bold text-text-tertiary",
          className,
        )}
      >
        이미지 없음
      </div>
    );
  }

  return (
    <img
      className={cn("object-cover", className)}
      src={posterUrl}
      alt={`${title} 포스터`}
      loading="lazy"
    />
  );
}
