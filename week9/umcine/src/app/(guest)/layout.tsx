import type { ReactNode } from "react";
import { RequireGuest } from "../../components/auth/require-guest";

// (guest)는 URL에 나타나지 않는 라우트 그룹이에요. 로그인하지 않은 사용자만 볼 페이지를 모아요.
export default function GuestLayout({ children }: { children: ReactNode }) {
  return <RequireGuest>{children}</RequireGuest>;
}
