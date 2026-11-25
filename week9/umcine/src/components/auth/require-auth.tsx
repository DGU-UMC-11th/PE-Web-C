"use client";

import { useRouter } from "next/navigation";
import { useEffect, useRef, type ReactNode } from "react";
import { useAuthHydrated, useAuthStore } from "../../stores/auth-store";

// TanStack Router의 _authenticated beforeLoad를 대신해요.
// 토큰은 localStorage(브라우저)에 있어서 서버가 아니라 브라우저에서 확인해요.
export function RequireAuth({ children }: { children: ReactNode }) {
  const router = useRouter();
  const hydrated = useAuthHydrated();
  const accessToken = useAuthStore((state) => state.accessToken);
  // 처음 들어올 때만 검사해요. 로그아웃처럼 페이지 안에서 토큰이 사라진 경우는 헤더가 이동을 맡아요.
  const checkedRef = useRef(false);

  useEffect(() => {
    if (!hydrated || checkedRef.current) return;
    checkedRef.current = true;

    if (!accessToken) {
      alert("로그인이 필요해요.");
      router.replace("/login");
    }
  }, [hydrated, accessToken, router]);

  if (!hydrated || !accessToken) return null;
  return children;
}
