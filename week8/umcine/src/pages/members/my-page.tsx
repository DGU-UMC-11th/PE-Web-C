import { Link, useNavigate } from "@tanstack/react-router";
import { useQueries } from "@tanstack/react-query";
import { movieQueries } from "../../api/movies/queries";
import { EmptyState, ErrorState } from "../../components/common/async-state";
import { MoviePoster } from "../../components/movies/movie-poster";
import { useFavoritesQuery } from "../../hooks/use-favorites";
import { useMeQuery } from "../../hooks/use-me-query";
import { useMyRatingsQuery } from "../../hooks/use-my-ratings";
import { useAuthStore } from "../../stores/auth-store";
import { getTmdbPosterUrl } from "../../utils/movies/tmdb-image";

export function MyPage() {
  const navigate = useNavigate();
  const setAccessToken = useAuthStore((state) => state.setAccessToken);

  const meQuery = useMeQuery();
  const favoritesQuery = useFavoritesQuery();
  const myRatingsQuery = useMyRatingsQuery();

  // 즐겨찾기는 movieId만 저장하므로, 제목과 포스터는 TMDB에서 가져와요.
  // 6주차에 만든 상세 queryOptions를 그대로 재사용하면 캐시도 공유돼요.
  const favoriteMovies = useQueries({
    queries: (favoritesQuery.data ?? []).map((favorite) =>
      movieQueries.detail(favorite.movieId),
    ),
  });

  const handleLogout = () => {
    setAccessToken(null);
    navigate({ to: "/" });
  };

  return (
    <section className="flex w-full max-w-[760px] flex-col gap-8">
      <div className="flex flex-col gap-6 rounded-2xl border border-border bg-surface p-7">
        <div className="flex items-start justify-between gap-4">
          <div className="flex flex-col gap-1.5">
            <h1 className="text-[28px] font-bold tracking-[-1px] text-ink">
              마이페이지
            </h1>
            <p className="text-sm text-secondary">
              내 정보와 즐겨찾기한 영화를 확인할 수 있어요.
            </p>
          </div>

          <button
            type="button"
            onClick={handleLogout}
            className="h-[38px] shrink-0 rounded-lg border border-border px-3 text-xs font-bold text-secondary"
          >
            로그아웃
          </button>
        </div>

        {meQuery.isError ? (
          <ErrorState message="내 정보를 불러오지 못했어요." />
        ) : (
          <dl className="flex flex-col divide-y divide-border border-y border-border">
            <InfoRow label="이메일" value={meQuery.data?.email ?? "불러오는 중…"} />
            <InfoRow label="닉네임" value={meQuery.data?.nickname ?? "불러오는 중…"} />
            <InfoRow label="남긴 평점" value={`${myRatingsQuery.data?.length ?? 0}편`} />
          </dl>
        )}

        <Link
          to="/me/edit"
          className="flex h-[50px] items-center justify-center rounded-[10px] bg-ink text-sm font-extrabold text-white"
        >
          정보 수정
        </Link>
      </div>

      <div className="flex flex-col gap-4">
        <h2 className="text-xl font-bold text-ink">
          즐겨찾기한 영화{" "}
          <span className="text-sm font-bold text-muted">
            {favoritesQuery.data?.length ?? 0}편
          </span>
        </h2>

        {favoritesQuery.isPending ? (
          <p className="py-16 text-center text-muted">불러오는 중이에요.</p>
        ) : favoritesQuery.isError ? (
          <ErrorState
            message="즐겨찾기를 불러오지 못했어요."
            onRetry={() => favoritesQuery.refetch()}
          />
        ) : favoritesQuery.data.length === 0 ? (
          <EmptyState message="아직 즐겨찾기한 영화가 없어요." />
        ) : (
          <ul className="grid grid-cols-2 gap-5 sm:grid-cols-3 lg:grid-cols-4">
            {favoritesQuery.data.map((favorite, index) => {
              const movie = favoriteMovies[index]?.data;

              return (
                <li key={favorite.favoriteId} className="flex flex-col gap-2">
                  <Link
                    to="/movies/$movieId"
                    params={{ movieId: String(favorite.movieId) }}
                  >
                    <MoviePoster
                      src={getTmdbPosterUrl(movie?.poster_path ?? null)}
                      alt={movie ? `${movie.title} 포스터` : "포스터"}
                      className="aspect-[2/3] w-full rounded-xl bg-surface-hover"
                    />
                  </Link>
                  <p className="truncate text-sm font-semibold text-ink">
                    {movie?.title ?? `영화 #${favorite.movieId}`}
                  </p>
                </li>
              );
            })}
          </ul>
        )}
      </div>
    </section>
  );
}

interface InfoRowProps {
  label: string;
  value: string;
}

function InfoRow({ label, value }: InfoRowProps) {
  return (
    <div className="flex items-center justify-between gap-4 py-4">
      <dt className="text-sm font-bold text-secondary">{label}</dt>
      <dd className="min-w-0 truncate text-sm text-ink">{value}</dd>
    </div>
  );
}
