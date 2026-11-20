import { authApi } from "../auth-api";

export interface Favorite {
  favoriteId: number;
  movieId: number;
  createdAt: string;
}

interface ApiEnvelope<T> {
  isSuccess: boolean;
  code: string;
  message: string;
  result: T;
}

/** GET /favorites — 내 즐겨찾기 목록 (빈 배열도 정상이에요) */
export async function getFavorites(): Promise<Favorite[]> {
  const response = await authApi.get("favorites").json<ApiEnvelope<Favorite[]>>();
  return response.result;
}

/** GET /favorites/{movieId} — 이 영화를 즐겨찾기했는지 */
export async function getFavoriteStatus(movieId: number): Promise<boolean> {
  const response = await authApi
    .get(`favorites/${movieId}`)
    .json<ApiEnvelope<{ isFavorite: boolean }>>();
  return response.result.isFavorite;
}

/** POST /favorites */
export async function createFavorite(movieId: number): Promise<Favorite> {
  const response = await authApi
    .post("favorites", { json: { movieId } })
    .json<ApiEnvelope<Favorite>>();
  return response.result;
}

/** DELETE /favorites/{movieId} */
export async function deleteFavorite(movieId: number): Promise<void> {
  await authApi.delete(`favorites/${movieId}`).json<ApiEnvelope<null>>();
}
