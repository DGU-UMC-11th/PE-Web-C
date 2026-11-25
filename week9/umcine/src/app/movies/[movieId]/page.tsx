import type { Metadata } from "next";
import { MovieDetailPage } from "../../../views/movies/movie-detail-page";

export const metadata: Metadata = { title: "영화 상세" };

// TanStack Router의 movies.$movieId.tsx → Next.js의 movies/[movieId]/page.tsx
// params는 요청을 받아야 알 수 있는 값이라, 같은 폴더의 loading.tsx가 Suspense 경계를 만들어 줘요.
export default async function MovieDetail({
  params,
}: PageProps<"/movies/[movieId]">) {
  const { movieId } = await params;
  return <MovieDetailPage movieIdParam={movieId} />;
}
