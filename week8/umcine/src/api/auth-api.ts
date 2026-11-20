import { useAuthStore } from "../stores/auth-store";
import { apiClient } from "./api-client";

// 기존 apiClient 설정을 이어받고, 요청마다 최신 토큰을 헤더에 붙여요.
export const authApi = apiClient.extend({
  hooks: {
    beforeRequest: [
      ({ request }) => {
        const accessToken = useAuthStore.getState().accessToken;
        if (accessToken) {
          request.headers.set("Authorization", `Bearer ${accessToken}`);
        }
      },
    ],
    afterResponse: [
      ({ response }) => {
        // 토큰이 없거나 만료·위조된 경우 저장된 토큰을 비워요.
        if (response.status === 401) {
          useAuthStore.getState().setAccessToken(null);
        }
      },
    ],
  },
});
