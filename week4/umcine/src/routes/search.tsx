import { createFileRoute } from "@tanstack/react-router";
import { SearchPage } from "../pages/movies/search-page.tsx";

export const Route = createFileRoute("/search")({
  validateSearch: (search): { query?: string } => ({
    query:
      typeof search.query === "string" || typeof search.query === "number" || typeof search.query === "boolean"
        ? String(search.query)
        : undefined,
  }),
  component: SearchPage,
});
