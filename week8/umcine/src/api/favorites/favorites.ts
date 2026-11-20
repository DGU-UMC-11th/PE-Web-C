import { authApi } from "../auth-api";
import type { ApiResponse } from "../types";

interface Favorite {
  favoriteId: number;
  movieId: number;
  createdAt: string;
}

interface FavoriteStatus {
  isFavorite: boolean;
}

async function getFavorites(): Promise<Favorite[]> {
  const response = await authApi
    .get("favorites")
    .json<ApiResponse<Favorite[]>>();
  return response.result;
}

async function getFavoriteStatus(movieId: number): Promise<FavoriteStatus> {
  const response = await authApi
    .get(`favorites/${movieId}`)
    .json<ApiResponse<FavoriteStatus>>();
  return response.result;
}

function addFavorite(movieId: number) {
  return authApi
    .post("favorites", { json: { movieId } })
    .json<ApiResponse<Favorite>>();
}

function removeFavorite(movieId: number) {
  return authApi.delete(`favorites/${movieId}`).json<ApiResponse<null>>();
}

export {
  addFavorite,
  getFavorites,
  getFavoriteStatus,
  removeFavorite,
  type Favorite,
  type FavoriteStatus,
};
