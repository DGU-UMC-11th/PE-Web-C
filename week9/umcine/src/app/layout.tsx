import type { Metadata } from "next";
import { Header } from "../components/layout/header";
import "./globals.css";
import { Providers } from "./providers";

// metadata는 Server Component에서만 export할 수 있어서 layout을 Server Component로 둬요.
export const metadata: Metadata = {
  title: { default: "UMCine", template: "%s | UMCine" },
  description: "TMDB 영화를 둘러보고 평점과 즐겨찾기를 남기는 UMCine",
};

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html lang="ko">
      <body>
        <Providers>
          <Header />
          {children}
        </Providers>
      </body>
    </html>
  );
}
