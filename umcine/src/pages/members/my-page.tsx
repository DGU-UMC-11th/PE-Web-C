import { useQueries } from "@tanstack/react-query";
import { Link } from "@tanstack/react-router";
import { getMovieDetail } from "../../api/movies/get-movie-detail";
import { useBookmarkStore } from "../../stores/bookmark-store";

const IMAGE_BASE_URL = "https://image.tmdb.org/t/p";

// 서버 연동 전 임시 데이터
const TEMP_PROFILE = {
  nickname: "mini0722",
  email: "llltop11@naver.com",
};

function PersonIcon() {
  return (
    <svg
      viewBox="0 0 24 24"
      className="size-8 text-gray-900"
      fill="currentColor"
    >
      <circle cx="12" cy="8" r="4" />
      <path d="M4 21c0-4.4 3.6-7 8-7s8 2.6 8 7z" />
    </svg>
  );
}

export function MyPage() {
  // 내가 북마크한 영화 ID 목록
  const bookmarkedMovieIds = useBookmarkStore(
    (state) => state.bookmarkedMovieIds,
  );

  // 영화 상세 페이지와 같은 query key를 써서 캐시를 함께 사용해요
  const bookmarkQueries = useQueries({
    queries: bookmarkedMovieIds.map((movieId) => ({
      queryKey: ["movies", "detail", movieId],
      queryFn: () => getMovieDetail(movieId),
    })),
  });

  return (
    <main className="mx-auto max-w-6xl px-6 py-10">
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-bold">내 정보</h1>
        <Link
          to="/my/edit"
          className="rounded-lg bg-blue-600 px-4 py-2.5 text-xs font-semibold text-white hover:bg-blue-700"
        >
          정보 수정
        </Link>
      </div>

      <section className="mt-6 border-t border-gray-200 pt-6">
        <h2 className="text-sm font-bold">기본 정보</h2>
        <div className="mt-4 flex items-center gap-6">
          <div className="flex size-20 items-center justify-center rounded-full bg-gray-200">
            <PersonIcon />
          </div>
          <dl className="grid grid-cols-1 gap-x-20 gap-y-3 sm:grid-cols-[auto_auto]">
            <div>
              <dt className="text-[11px] text-gray-400">닉네임</dt>
              <dd className="text-sm font-bold">{TEMP_PROFILE.nickname}</dd>
            </div>
            <div>
              <dt className="text-[11px] text-gray-400">이메일</dt>
              <dd className="text-sm font-bold">{TEMP_PROFILE.email}</dd>
            </div>
          </dl>
        </div>
      </section>

      <section className="mt-8 border-t border-gray-200 pt-6">
        <h2 className="text-sm font-bold">내 즐겨찾기</h2>

        {bookmarkedMovieIds.length === 0 ? (
          <p className="py-16 text-center text-sm text-gray-500">
            아직 즐겨찾기한 영화가 없어요.
          </p>
        ) : (
          <ul className="mt-4 grid grid-cols-2 gap-5 sm:grid-cols-3 lg:grid-cols-5">
            {bookmarkQueries.map((query, index) => {
              const movieId = bookmarkedMovieIds[index];

              if (query.isPending) {
                return (
                  <li key={movieId}>
                    <div className="aspect-[2/3] w-full animate-pulse rounded-lg bg-gray-200" />
                  </li>
                );
              }

              if (query.isError) {
                return (
                  <li key={movieId} className="text-xs text-gray-500">
                    영화 정보를 불러오지 못했어요.
                  </li>
                );
              }

              const movie = query.data;
              return (
                <li key={movie.id}>
                  <Link
                    to="/movies/$movieId"
                    params={{ movieId: String(movie.id) }}
                  >
                    {movie.poster_path ? (
                      <img
                        src={`${IMAGE_BASE_URL}/w500${movie.poster_path}`}
                        alt={`${movie.title} 포스터`}
                        className="aspect-[2/3] w-full rounded-lg object-cover"
                      />
                    ) : (
                      <div className="aspect-[2/3] w-full rounded-lg bg-gray-200" />
                    )}
                    <h3 className="mt-2 truncate text-sm font-semibold">
                      {movie.title}
                    </h3>
                  </Link>
                  <p className="text-xs text-gray-400">
                    {movie.release_date.replaceAll("-", ".")}
                  </p>
                </li>
              );
            })}
          </ul>
        )}
      </section>
    </main>
  );
}
