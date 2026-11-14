import { HTTPError } from "ky";

// ky는 성공 범위가 아닌 status에서 HTTPError를 던져요.
// 404(영화 없음)와 그 밖의 실패를 구분해서 사용자 문구를 다르게 보여줘요.
export function getMovieDetailErrorMessage(error: unknown) {
  if (error instanceof HTTPError && error.response.status === 404) {
    return "영화를 찾을 수 없어요.";
  }

  return "영화 정보를 불러오지 못했어요.";
}
