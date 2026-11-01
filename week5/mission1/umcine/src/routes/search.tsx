import { createFileRoute } from "@tanstack/react-router";
import { SearchPage } from "../pages/movies/search-page";
import { parsePageSearchParam } from "../utils/page-search-param";

export const Route = createFileRoute("/search")({
  validateSearch: (
    search
  ): { query?: string; page?: number } => ({
    query:
      typeof search.query === "string" ||
      typeof search.query === "number" ||
      typeof search.query === "boolean"
        ? String(search.query)
        : undefined,

    page: parsePageSearchParam(search.page),
  }),
  component: SearchPage,
});
