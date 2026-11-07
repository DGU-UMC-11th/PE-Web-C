import {
  createFileRoute,
  useSearch,
} from "@tanstack/react-router";

import { SearchPage } from "../pages/movies/search-page";
import { parsePageSearchParam } from "../utils/page-search-param";

function SearchRoute() {
  const { query, page } = useSearch({
    from: "/search",
  });

  const apiPage = Math.ceil((page ?? 1) / 2);

  return (
    <SearchPage
      key={`${query ?? ""}:${apiPage}`}
    />
  );
}

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
  component: SearchRoute,
});