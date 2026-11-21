import {
  createFileRoute,
  useParams,
} from "@tanstack/react-router";

import { MovieDetailPage } from "../pages/movies/movie-detail-page";

function MovieDetailRoute() {
  const { movieId } = useParams({
    from: "/movies/$movieId",
  });

  return <MovieDetailPage key={movieId} />;
}

export const Route = createFileRoute("/movies/$movieId")({
  component: MovieDetailRoute,
});