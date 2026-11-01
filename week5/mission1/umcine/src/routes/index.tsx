import { createFileRoute } from "@tanstack/react-router";
import { MovieListPage } from "../pages/movies/movie-list-page";
import { parsePageSearchParam } from "../utils/page-search-param";

export const Route = createFileRoute("/")({
  validateSearch: (search): { page?: number } => ({
    page: parsePageSearchParam(search.page),
  }),
  component: MovieListPage,
});
