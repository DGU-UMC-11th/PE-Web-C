import { Link } from "@tanstack/react-router";
import type { ReactNode } from "react";
import { cn } from "../../utils/cn";

type PageDestination =
  | { to: "/"; search: { page?: number } }
  | { to: "/search"; search: { query: string; page?: number } };

interface PaginationProps {
  currentPage: number;
  totalPages: number;
  getPageDestination: (page: number) => PageDestination;
}

export default function Pagination({ currentPage, totalPages, getPageDestination }: PaginationProps) {
  if (totalPages < 1) return null;
  const startPage = Math.max(1, Math.min(currentPage - 2, Math.max(1, totalPages - 4)));
  const pages = Array.from({ length: Math.min(5, totalPages - startPage + 1) }, (_, index) => startPage + index);
  const linkClass = "flex size-9 items-center justify-center rounded-[7px] text-sm text-[#656a73] hover:bg-[#e9ebef]";

  function pageLink(page: number, label: string, children: ReactNode, disabled = false) {
    if (disabled) {
      return <span role="link" aria-disabled="true" aria-label={label}
        className={cn(linkClass, "cursor-default opacity-30 hover:bg-transparent")}>{children}</span>;
    }
    return <Link {...getPageDestination(page)} aria-label={label}
      aria-current={currentPage === page ? "page" : undefined}
      className={cn(linkClass, currentPage === page && "bg-[#191b20] font-bold text-white hover:bg-[#191b20]")}>
      {children}
    </Link>;
  }

  return (
    <nav aria-label="영화 목록 페이지" className="mt-10 flex items-center justify-center gap-1">
      {pageLink(currentPage - 1, "이전 페이지", <img className="size-[18px]" src="/icons/chevron-left.svg" alt="" />, currentPage <= 1)}
      {pages.map((page) => <span key={page}>{pageLink(page, `${page}페이지`, page)}</span>)}
      {pageLink(currentPage + 1, "다음 페이지", <img className="size-[18px]" src="/icons/chevron-right.svg" alt="" />, currentPage >= totalPages)}
    </nav>
  );
}
