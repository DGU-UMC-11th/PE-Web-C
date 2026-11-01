// 4.2 실습: 순수 fetch 요청을 Network 패널에서 확인 (main.tsx에 임시로 import해서 실행)
import { getMoviesWithFetch } from "../api/movies/get-movies-with-fetch";

getMoviesWithFetch(1)
  .then((response) => console.log(response.results))
  .catch((error) => console.error(error));
