// TMDB 응답 모델. 서버 JSON과 비교하기 쉽도록 프로퍼티 이름을 snake_case 그대로 써요.

// 목록과 상세 응답에 공통으로 들어오는 필드
interface TmdbMovie {
  id: number;
  title: string;
  original_title: string;
  overview: string;
  poster_path: string | null;
  backdrop_path: string | null;
  release_date: string;
  vote_average: number;
  vote_count: number;
}

// 목록·검색 응답의 results 항목
interface TmdbMovieListItem extends TmdbMovie {
  genre_ids: number[];
}

interface TmdbMovieListResponse {
  page: number;
  results: TmdbMovieListItem[];
  total_pages: number;
  total_results: number;
}

interface TmdbGenre {
  id: number;
  name: string;
}

// 상세 응답
interface TmdbMovieDetail extends TmdbMovie {
  genres: TmdbGenre[];
  runtime: number | null;
  tagline: string;
}

export type {
  TmdbGenre,
  TmdbMovie,
  TmdbMovieDetail,
  TmdbMovieListItem,
  TmdbMovieListResponse,
};
