import { createFileRoute } from "@tanstack/react-router";
import { MyInfoPage } from "../../pages/members/my-info-page";

export const Route = createFileRoute("/me/")({ component: MyInfoPage });
