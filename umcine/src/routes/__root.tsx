import { createRootRoute, Outlet } from "@tanstack/react-router";
import { Header } from "../components/layout/header";
import { SiteFooter } from "../components/layout/site-footer";

export const Route = createRootRoute({
  component: () => (
    <div className="flex min-h-screen flex-col bg-bg-page">
      <Header />
      <Outlet />
      <SiteFooter />
    </div>
  ),
  notFoundComponent: () => (
    <main className="flex flex-1 flex-col gap-5 px-4 py-6 sm:px-10 lg:px-20">
      페이지를 찾을 수 없어요.
    </main>
  ),
});
