import { createFileRoute, redirect } from "@tanstack/react-router";
import { LoginPage } from "../pages/auth/login-page";
import { useAuthStore } from "../stores/auth-store";

export const Route = createFileRoute("/login")({
  // 화면을 그리기 전에 실행돼요. 이미 로그인했으면 로그인 폼을 보여줄 이유가 없어요.
  // 토큰이 "유효한지"는 내 정보 API가 확인해요. 여기는 폼 접근만 막아요.
  beforeLoad: () => {
    if (useAuthStore.getState().accessToken) {
      throw redirect({ to: "/" });
    }
  },
  component: LoginPage,
});
