import { createRootRoute, Outlet } from "@tanstack/react-router";
import Footer from "../components/layout/footer";
import Header from "../components/layout/header";

export const Route = createRootRoute({
  component: RootComponent,
  notFoundComponent: NotFoundComponent,
});

function RootComponent() {
  return (
    <>
      <Header />
      <Outlet />
      <Footer />
    </>
  );
}

function NotFoundComponent() {
  return <p className="page">페이지를 찾을 수 없어요.</p>;
}
