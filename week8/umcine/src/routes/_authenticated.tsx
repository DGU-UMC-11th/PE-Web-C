import { createFileRoute, Outlet, redirect } from "@tanstack/react-router";

/**
 * 필수 미션: 로그인해야 볼 수 있는 화면을 묶는 Layout Route예요.
 * 파일 이름이 _로 시작하면 주소에는 나타나지 않고 레이아웃 역할만 해요.
 * (/me, /me/edit 처럼 주소는 그대로 유지돼요)
 *
 * 하위 페이지가 늘어나도 로그인 검사와 공통 틀은 여기 한 곳만 고치면 돼요.
 */
export const Route = createFileRoute("/_authenticated")({
  beforeLoad: async () => {
    const { useAuthStore } = await import("../stores/auth-store");

    if (!useAuthStore.getState().accessToken) {
      throw redirect({ to: "/login" });
    }
  },
  component: AuthenticatedLayout,
});

function AuthenticatedLayout() {
  return (
    <div className="mx-auto flex w-full max-w-[1440px] flex-1 justify-center px-4 py-12 sm:px-6 lg:px-20">
      <Outlet />
    </div>
  );
}
