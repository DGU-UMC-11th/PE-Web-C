import { createFileRoute } from "@tanstack/react-router";
import { SearchPage } from "../pages/movies/search-page";

interface SearchParams {
  query?: string;
}

export const Route = createFileRoute("/search")({
  validateSearch: (search: Record<string, unknown>): SearchParams => ({
    query: typeof search.query === "string" ? search.query : undefined,
  }),
  component: SearchPage,
});
