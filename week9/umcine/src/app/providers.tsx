"use client";

import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { ReactQueryDevtools } from "@tanstack/react-query-devtools";
import { useEffect, useState, type ReactNode } from "react";
import { useAuthStore } from "../stores/auth-store";

const ONE_MINUTE = 60 * 1000;

// QueryClient와 저장된 토큰 읽기는 브라우저 상태라서 Client Component에서 준비해요.
export function Providers({ children }: { children: ReactNode }) {
  // 모듈 최상단에서 만들면 서버에서 여러 요청이 같은 캐시를 나눠 쓰게 돼서, 컴포넌트마다 한 번만 만들어요.
  const [queryClient] = useState(
    () =>
      new QueryClient({
        defaultOptions: { queries: { staleTime: ONE_MINUTE } },
      }),
  );

  useEffect(() => {
    // localStorage는 브라우저에만 있어서 화면이 붙은 뒤에 토큰을 읽어요.
    void useAuthStore.persist.rehydrate();
  }, []);

  return (
    <QueryClientProvider client={queryClient}>
      {children}
      <ReactQueryDevtools initialIsOpen={false} />
    </QueryClientProvider>
  );
}
