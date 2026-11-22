import { createFileRoute } from "@tanstack/react-router";
import { MyEditPage } from "../../../pages/members/my-edit-page";

export const Route = createFileRoute("/_authenticated/my/edit")({
  component: MyEditPage,
});
