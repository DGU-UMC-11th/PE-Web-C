import { cn } from "../../utils/cn";

interface MovieImageProps {
  src: string | null;
  alt: string;
  className?: string;
}

export function MovieImage({ src, alt, className }: MovieImageProps) {
  if (!src) {
    return (
      <div
        className={cn(
          "flex items-center justify-center bg-gray-200 text-sm text-gray-500",
          className
        )}
      >
        이미지 없음
      </div>
    );
  }

  return <img className={className} src={src} alt={alt} />;
}
