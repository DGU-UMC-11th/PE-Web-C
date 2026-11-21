import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import { createRouter, RouterProvider } from "@tanstack/react-router";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { ReactQueryDevtools } from "@tanstack/react-query-devtools";
import { routeTree } from "./routeTree.gen";
import { useAuthStore } from "./stores/auth-store";
import { FAVORITES_QUERY_KEY } from "./api/favorites/favorites";
import "./index.css";

const router = createRouter({ routeTree, scrollRestoration: true });

// 목록과 검색은 조회한 데이터를 1분 동안 최신으로 취급해요.
const queryClient = new QueryClient({
  defaultOptions: {
    queries: { staleTime: 60 * 1000 },
  },
});

useAuthStore.subscribe(({ accessToken }, previous) => {
  if (!previous.accessToken || previous.accessToken === accessToken) return;
  queryClient.removeQueries({ queryKey: ["members"] });
  queryClient.removeQueries({ queryKey: FAVORITES_QUERY_KEY });
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
