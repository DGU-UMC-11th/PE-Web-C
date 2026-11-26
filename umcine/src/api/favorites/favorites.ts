import { authApi } from "../auth-api";

export interface Favorite {
  favoriteId: number;
  movieId: number;
  createdAt: string;
}

interface ApiResponse<T> {
  isSuccess: boolean;
  code: string;
  message: string;
  result: T;
}

export function getFavorites() {
  return authApi.get("favorites").json<ApiResponse<Favorite[]>>();
}

export function getFavoriteStatus(movieId: number) {
  return authApi
    .get(`favorites/${movieId}`)
    .json<ApiResponse<{ isFavorite: boolean }>>();
}

export function createFavorite(movieId: number) {
  return authApi
    .post("favorites", {
      json: { movieId },
    })
    .json<ApiResponse<Favorite>>();
}

export function deleteFavorite(movieId: number) {
  return authApi.delete(`favorites/${movieId}`).json<ApiResponse<null>>();
}
