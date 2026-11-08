// 5주차 백엔드 API 명세에서 합의한 응답 모양

// GET /members/nickname/{nickname}, GET /members/email/{email}
interface AvailabilityResponse {
  available: boolean;
}

// GET /members/{memberId}/ratings 의 배열 항목
interface MemberRating {
  ratingId: number;
  movieId: number; // TMDB 영화 ID
  score: number; // 1~5
  comment: string | null;
  createdAt: string; // "2026-11-01T16:00:00"
  updatedAt: string;
}

export type { AvailabilityResponse, MemberRating };
