import { useAuthStore } from "../stores/auth-store";
import { apiClient } from "./api-client";

/**
 * 인증이 필요한 요청용 인스턴스예요.
 * extend는 기존 설정(서버 주소)을 이어받아 거기에 인증 처리만 더해요.
 *
 * 설치된 ky는 1.x라서 hook이 객체가 아니라 인자를 차례대로 받아요.
 * (2.x 예제의 `({ request })` 형태와 다릅니다)
 */
export const authApi = apiClient.extend({
  hooks: {
    beforeRequest: [
      (request) => {
        // 컴포넌트 바깥이라 getState()로 store의 "지금" 값을 읽어요.
        const accessToken = useAuthStore.getState().accessToken;
        if (accessToken) {
          request.headers.set("Authorization", `Bearer ${accessToken}`);
        }
      },
    ],
    afterResponse: [
      (_request, _options, response) => {
        // 토큰이 만료되거나 위조됐으면 서버가 401을 줘요. 들고 있을 이유가 없으니 비워요.
        if (response.status === 401) {
          useAuthStore.getState().setAccessToken(null);
        }
        return response;
      },
    ],
  },
});
