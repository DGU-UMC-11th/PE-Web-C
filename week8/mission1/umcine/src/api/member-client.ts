import { apiClient } from "./api-client";
import { useAuthStore } from "../stores/auth-store";

// 로그인·회원가입 요청과 달리 내 정보 요청에는 JWT를 함께 보내요.
export const memberClient = apiClient.extend({
  hooks: {
    beforeRequest: [({ request }) => {
      const token = useAuthStore.getState().accessToken;
      if (token) request.headers.set("Authorization", `Bearer ${token}`);
    }],
    afterResponse: [({ request, response }) => {
      const { accessToken, signOut } = useAuthStore.getState();
      if (response.status === 401 && accessToken &&
          request.headers.get("Authorization") === `Bearer ${accessToken}`) {
        signOut();
      }
    }],
  },
});
