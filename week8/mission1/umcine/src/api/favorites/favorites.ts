import { getApiResult, checkMutationResponse, MemberResponseError, type ApiResponse } from "../api-response";
import { memberClient } from "../member-client";

export interface Favorite {
  movieId: number;
}

type FavoritesResult = Favorite[] | { favorites: Favorite[] };
type FavoriteStatusResult = boolean | { isFavorite: boolean };

export const FAVORITES_QUERY_KEY = ["favorites"] as const;
export const favoriteStatusKey = (movieId: number) => [...FAVORITES_QUERY_KEY, movieId] as const;

export async function getFavorites(signal?: AbortSignal) {
  const response = await memberClient.get("favorites", { signal })
    .json<ApiResponse<FavoritesResult> | FavoritesResult>();
  const result = "isSuccess" in response ? getApiResult(response) : response;
  const favorites = Array.isArray(result) ? result : result.favorites;
  if (!Array.isArray(favorites)) throw new MemberResponseError("즐겨찾기 목록 응답을 확인해 주세요.");
  return favorites;
}

export async function getFavoriteStatus(movieId: number, signal?: AbortSignal) {
  const response = await memberClient.get(`favorites/${movieId}`, { signal })
    .json<ApiResponse<FavoriteStatusResult> | FavoriteStatusResult>();
  const result = typeof response !== "boolean" && "isSuccess" in response ? getApiResult(response) : response;
  const isFavorite = typeof result === "boolean" ? result : result.isFavorite;
  if (typeof isFavorite !== "boolean") throw new MemberResponseError("즐겨찾기 상태 응답을 확인해 주세요.");
  return isFavorite;
}

export async function addFavorite(movieId: number) {
  await checkMutationResponse(await memberClient.post("favorites", { json: { movieId } }));
}

export async function removeFavorite(movieId: number) {
  await checkMutationResponse(await memberClient.delete(`favorites/${movieId}`));
}
