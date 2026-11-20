import { env } from "../../config/env";
import type { TmdbMovieListResponse } from "./models";

// 라이브러리 없이 브라우저 fetch만으로 인기 영화를 요청해요.
// base URL, 인증 header, query 조립, 오류 처리를 전부 직접 작성하는 버전이라
// 5절에서 ky 인스턴스가 어떤 반복을 줄여주는지 비교하는 기준이 돼요.

type GetMoviesWithFetchResponse = TmdbMovieListResponse;

async function getMoviesWithFetch(
  page = 1,
): Promise<GetMoviesWithFetchResponse> {
  const searchParams = new URLSearchParams({
    language: "ko-KR",
    page: String(page),
  });

  const response = await fetch(
    `${env.tmdbApiBaseUrl}/movie/popular?${searchParams}`,
    {
      headers: {
        Authorization: `Bearer ${env.tmdbAccessToken}`,
      },
    },
  );

  // fetch는 네트워크 자체가 실패할 때만 reject해요.
  // 404나 500 같은 HTTP 오류는 reject되지 않으므로 response.ok를 직접 확인해요.
  if (!response.ok) {
    throw new Error(`영화 목록 요청에 실패했어요: ${response.status}`);
  }

  return response.json();
}

export { getMoviesWithFetch, type GetMoviesWithFetchResponse };
