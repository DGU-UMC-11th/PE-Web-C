import type { Metadata } from "next";
import { LoginPage } from "../../../views/auth/login-page";

export const metadata: Metadata = { title: "로그인" };

export default function Login() {
  return <LoginPage />;
}
