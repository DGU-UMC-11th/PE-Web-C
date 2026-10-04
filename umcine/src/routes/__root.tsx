import { createRootRoute, Outlet } from "@tanstack/react-router";
import { Header } from "../components/layout/header";
import { Footer } from "../components/layout/footer";

export const Route = createRootRoute({
  component: () => (
    <div className="flex min-h-screen flex-col bg-gray-50 text-gray-900">
      <Header />
      <div className="flex-1">
        <Outlet />
      </div>
      <Footer />
    </div>
  ),
});