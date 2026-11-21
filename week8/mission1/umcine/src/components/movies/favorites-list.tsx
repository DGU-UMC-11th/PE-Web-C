import { useQuery } from "@tanstack/react-query";
import { Link } from "@tanstack/react-router";
import { movieDetailOptions } from "../../api/movies/get-movie-detail";
import { useFavorites } from "../../hooks/use-favorites";
import { getMemberErrorMessage } from "../../utils/get-member-error-message";
import { getTmdbPosterUrl } from "../../utils/tmdb-image";
import { secondaryButtonClass } from "../auth/auth-ui";

function FavoriteMovie({ movieId }: { movieId: number }) {
  const { data: movie } = useQuery(movieDetailOptions(movieId));
  const posterUrl = getTmdbPosterUrl(movie?.poster_path ?? null);

  return (
    <li>
      <Link to="/movies/$movieId" params={{ movieId: String(movieId) }}
        className="flex items-center gap-3 rounded-lg border border-[#e8e9ed] px-3 py-2 text-sm font-bold hover:bg-gray-50">
        {posterUrl && <img className="h-12 w-8 rounded-sm object-cover" src={posterUrl} alt="" />}
        <span>{movie?.title ?? `영화 #${movieId}`}</span>
      </Link>
    </li>
  );
}

export function FavoritesList() {
  const favorites = useFavorites();

  return (
    <section aria-labelledby="favorites-title" className="mt-8 border-t border-[#e8e9ed] pt-6">
      <h2 id="favorites-title" className="mb-3 text-lg font-extrabold">즐겨찾기</h2>
      {favorites.isLoading && <p role="status" className="text-sm text-[#656a73]">즐겨찾기를 불러오는 중이에요.</p>}
      {favorites.isError && (
        <div className="space-y-3">
          <p role="alert" className="text-sm text-red-700">
            {getMemberErrorMessage(favorites.error, "즐겨찾기를 불러오지 못했어요.")}
          </p>
          <button type="button" className={secondaryButtonClass} disabled={favorites.isFetching}
            onClick={() => void favorites.refetch()}>다시 시도</button>
        </div>
      )}
      {favorites.data?.length === 0 && !favorites.isError && (
        <p className="text-sm text-[#656a73]">즐겨찾기에 추가한 영화가 없어요.</p>
      )}
      {!!favorites.data?.length && (
        <ul className="space-y-2">
          {favorites.data.map(({ movieId }) => <FavoriteMovie key={movieId} movieId={movieId} />)}
        </ul>
      )}
    </section>
  );
}
