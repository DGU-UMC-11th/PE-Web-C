import { cn } from "../../utils/cn";

interface PaginationProps {
  currentPage: number;
  totalPages: number;
  onPageChange: (page: number) => void;
}

const ARROW_CLASS =
  "flex size-6 items-center justify-center disabled:cursor-default disabled:opacity-35";

export function Pagination({ currentPage, totalPages, onPageChange }: PaginationProps) {
  const pages = Array.from({ length: totalPages }, (_, index) => index + 1);

  return (
    <nav className="flex w-full items-center justify-center gap-3" aria-label="영화 목록 페이지">
      <button
        type="button"
        className={ARROW_CLASS}
        aria-label="이전 페이지"
        disabled={currentPage === 1}
        onClick={() => onPageChange(currentPage - 1)}
      >
        <img src="/icons/chevron-left.svg" alt="" width={24} height={24} />
      </button>

      <div className="flex items-center gap-1">
        {pages.map((page) => (
          <button
            key={page}
            type="button"
            className={cn(
              "flex size-9 items-center justify-center rounded-[7px] text-center text-[13px] font-bold",
              page === currentPage ? "bg-text-primary text-bg-surface" : "text-text-secondary",
            )}
            aria-current={page === currentPage ? "page" : undefined}
            onClick={() => onPageChange(page)}
          >
            {page}
          </button>
        ))}
      </div>

      <button
        type="button"
        className={ARROW_CLASS}
        aria-label="다음 페이지"
        disabled={currentPage === totalPages}
        onClick={() => onPageChange(currentPage + 1)}
      >
        <img src="/icons/chevron-right.svg" alt="" width={24} height={24} />
      </button>
    </nav>
  );
}
