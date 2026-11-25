import Image from "next/image";
import { cn } from "../../utils/cn";

// TMDB 원본 비율(포스터 w500 = 2:3, 배경 w1280 = 16:9)로 자리를 미리 잡아 layout shift를 줄여요.
const IMAGE_SIZE = {
  poster: { width: 500, height: 750 },
  backdrop: { width: 1280, height: 720 },
} as const;

interface MovieImageProps {
  src: string | null;
  alt: string;
  className?: string;
  variant?: keyof typeof IMAGE_SIZE;
  // 화면에서 차지하는 너비. 브라우저가 이 크기에 맞는 파일만 받아요.
  sizes?: string;
  priority?: boolean;
}

export function MovieImage({
  src,
  alt,
  className,
  variant = "poster",
  sizes = "200px",
  priority = false,
}: MovieImageProps) {
  if (!src) {
    return (
      <div
        className={cn(
          "flex items-center justify-center bg-gray-200 text-sm text-gray-500",
          className,
        )}
      >
        이미지 없음
      </div>
    );
  }

  // next/image는 필요한 크기와 형식(webp 등)으로 바꿔서 주고, 화면 가까이 올 때 불러와요(lazy loading).
  return (
    <Image
      className={className}
      src={src}
      alt={alt}
      width={IMAGE_SIZE[variant].width}
      height={IMAGE_SIZE[variant].height}
      sizes={sizes}
      priority={priority}
    />
  );
}
