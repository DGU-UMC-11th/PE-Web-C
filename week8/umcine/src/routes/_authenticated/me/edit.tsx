import { createFileRoute } from "@tanstack/react-router";
import { MyInfoEditPage } from "../../../pages/members/my-info-edit-page";

export const Route = createFileRoute("/_authenticated/me/edit")({
  component: MyInfoEditPage,
});
