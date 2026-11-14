import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import { createRouter, RouterProvider } from "@tanstack/react-router";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { ReactQueryDevtools } from "@tanstack/react-query-devtools";
import { routeTree } from "./routeTree.gen";
import "./index.css";

const router = createRouter({ routeTree });

const ONE_MINUTE = 60 * 1000;

// QueryClient는 캐시와 요청 기본 설정을 관리하는 객체예요.
// staleTime을 1분으로 두면, 조회한 지 1분이 지나지 않은 데이터는 fresh로 취급해 다시 요청하지 않아요.
// (기본값 0이면 받은 즉시 stale이 되어, 화면을 다시 열 때마다 재조회해요.)
const queryClient = new QueryClient({
  defaultOptions: { queries: { staleTime: ONE_MINUTE } },
});

declare module "@tanstack/react-router" {
  interface Register {
    router: typeof router;
  }
}

createRoot(document.getElementById("root")!).render(
  <StrictMode>
    <QueryClientProvider client={queryClient}>
      <RouterProvider router={router} />
      <ReactQueryDevtools initialIsOpen={false} />
    </QueryClientProvider>
  </StrictMode>,
);
