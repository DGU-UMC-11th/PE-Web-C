// TMDB의 "2026-07-29"를 기존 디자인의 "2026.07.29"로 바꿔요. 값이 없으면 안내 문구를 돌려줘요.
export function formatReleaseDate(releaseDate: string) {
  return releaseDate ? releaseDate.replaceAll("-", ".") : "개봉일 미정";
}

// 상영 시간(분)을 "2시간 25분"처럼 바꿔요.
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
