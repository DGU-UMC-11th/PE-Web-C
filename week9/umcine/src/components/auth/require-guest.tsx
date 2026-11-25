"use client";

import { useRouter } from "next/navigation";
import { useEffect, type ReactNode } from "react";
import { useAuthHydrated, useAuthStore } from "../../stores/auth-store";

// 이미 로그인한 사용자가 /login을 직접 열면 홈으로 보내요. (TanStack Router login.tsx의 beforeLoad)
export function RequireGuest({ children }: { children: ReactNode }) {
  const router = useRouter();
  const hydrated = useAuthHydrated();
  const accessToken = useAuthStore((state) => state.accessToken);

  useEffect(() => {
    if (hydrated && accessToken) {
      router.replace("/");
    }
  }, [hydrated, accessToken, router]);

  // 저장된 토큰을 읽기 전이거나 로그인 상태면 로그인 폼을 보여 주지 않아요.
  if (!hydrated || accessToken) return null;
  return children;
}
