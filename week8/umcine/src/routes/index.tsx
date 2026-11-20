import { createFileRoute } from "@tanstack/react-router";
import { MovieListPage } from "../pages/movies/movie-list-page";

interface MovieListSearchParams {
  page?: number;
}

// 선택 미션: 페이지 번호를 search param으로 관리해서 새로고침·뒤로가기에도 유지돼요.
export const Route = createFileRoute("/")({
  validateSearch: (search: Record<string, unknown>): MovieListSearchParams => {
    const page = Number(search.page);

    return {
      page: Number.isInteger(page) && page > 0 ? page : undefined,
    };
  },
  component: MovieListPage,
});
