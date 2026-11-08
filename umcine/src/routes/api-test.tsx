import { createFileRoute } from "@tanstack/react-router";
import ApiTestPage from "../pages/ApiTestPage";

export const Route = createFileRoute("/api-test")({
  component: ApiTestPage,
});
