import { cn } from "../../utils/cn";

interface MoviePosterProps {
  src: string | null;
  alt: string;
  className?: string;
}

// poster_path가 null이면 같은 크기의 회색 영역에 "이미지 없음"을 보여줘요.
// null이나 빈 문자열을 <img>의 src에 그대로 넣지 않아요.
export function MoviePoster({ src, alt, className }: MoviePosterProps) {
  if (!src) {
    return (
      <div
        className={cn(
          "grid place-items-center bg-surface-hover text-xs text-muted",
          className,
        )}
        role="img"
        aria-label={`${alt} (이미지 없음)`}
      >
        이미지 없음
      </div>
    );
  }

  return (
    <img src={src} alt={alt} loading="lazy" className={cn("object-cover", className)} />
  );
}
