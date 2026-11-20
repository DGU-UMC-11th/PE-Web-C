import { createFileRoute, Outlet, redirect } from "@tanstack/react-router";
import { useAuthStore } from "../../stores/auth-store";

// _authenticated 폴더는 URL에 나타나지 않는 경로 없는 Layout Route예요.
// 로그인 후에만 볼 수 있는 페이지를 이 폴더에 모으고, 접근 검사를 한 곳에서 해요.
export const Route = createFileRoute("/_authenticated")({
  beforeLoad: () => {
    if (!useAuthStore.getState().accessToken) {
      alert("로그인이 필요해요.");
      throw redirect({ to: "/login" });
    }
  },
  // 공통 Layout으로 하위 페이지(/me, /me/edit)를 그대로 렌더링해요.
  component: Outlet,
});
