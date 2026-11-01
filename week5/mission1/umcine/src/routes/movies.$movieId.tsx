import { createFileRoute } from "@tanstack/react-router";
import { MovieDetailPage } from "../pages/movies/movie-detail-page.tsx";

export const Route = createFileRoute("/movies/$movieId")({
  component: MovieDetailPage,
});