import { MovieListPage } from "../views/movies/movie-list-page";

// 페이지는 Server Component로 두고, 상태와 클릭이 필요한 화면만 Client Component로 불러와요.
export default function HomePage() {
  return <MovieListPage />;
}
