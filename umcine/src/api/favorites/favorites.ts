import { authApi } from "../auth-api";

export interface Favorite {
  favoriteId: number;
  movieId: number;
  createdAt: string;
}

interface Res<T> {
  isSuccess: boolean;
  code: string;
  message: string;
  result: T;
}

export async function getFavorites() {
  const res = await authApi.get("favorites").json<Res<Favorite[]>>();
  return res.result;
}

export async function getFavoriteStatus(movieId: number) {
  const res = await authApi
    .get(`favorites/${movieId}`)
    .json<Res<{ isFavorite: boolean }>>();
  return res.result.isFavorite;
}

export function addFavorite(movieId: number) {
  return authApi.post("favorites", { json: { movieId } }).json<Res<Favorite>>();
}

export function removeFavorite(movieId: number) {
  return authApi.delete(`favorites/${movieId}`).json<Res<null>>();
}
