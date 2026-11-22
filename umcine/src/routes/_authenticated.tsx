import { createFileRoute, Outlet, redirect } from "@tanstack/react-router";
import { useAuthStore } from "../stores/auth-store";

export const Route = createFileRoute("/_authenticated")({
  beforeLoad: () => {
    // 토큰이 없으면 로그인 페이지로 보냄
    if (!useAuthStore.getState().accessToken) {
      throw redirect({ to: "/login" });
    }
  },
  component: AuthenticatedLayout,
});

function AuthenticatedLayout() {
  // 하위 페이지(마이페이지, 내 정보 수정)가 이 자리에 렌더링돼요
  return <Outlet />;
}
