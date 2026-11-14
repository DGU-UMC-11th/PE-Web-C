// TMDB의 runtime은 분 단위 숫자이고, 값이 없으면 null이 와요.
export function formatRuntime(runtime: number | null) {
  if (runtime === null || runtime <= 0) {
    return "상영 시간 정보가 없어요.";
  }

  const hours = Math.floor(runtime / 60);
  const minutes = runtime % 60;

  if (hours === 0) return `${minutes}분`;
  if (minutes === 0) return `${hours}시간`;

  return `${hours}시간 ${minutes}분`;
}

// TMDB의 release_date는 "2026-08-05" 형태의 문자열이고, 미개봉작은 빈 문자열일 수 있어요.
export function formatReleaseDate(releaseDate: string) {
  if (!releaseDate) return "개봉일 미정";

  return releaseDate.replaceAll("-", ".");
}
