import { cn } from "../../utils/cn";

interface PaginationProps {
  currentPage: number;
  totalPages: number;
  onChangePage: (page: number) => void;
}

export default function Pagination({
  currentPage,
  totalPages,
  onChangePage,
}: PaginationProps) {
  const pages = Array.from({ length: totalPages }, (_, index) => index + 1);

  return (
    <nav
      className="mt-14 flex items-center justify-center gap-2"
      aria-label="페이지 이동"
    >
      <button
        type="button"
        className="grid size-9 place-items-center rounded-lg text-sm text-muted transition-colors enabled:hover:bg-surface-hover enabled:hover:text-ink disabled:opacity-30"
        aria-label="이전 페이지"
        disabled={currentPage === 1}
        onClick={() => onChangePage(currentPage - 1)}
      >
        <span
          className="icon size-5 [--icon-url:url('/icons/chevron-left.svg')]"
          aria-hidden="true"
        />
      </button>

      <ol className="flex gap-1">
        {pages.map((page) => {
          const isActive = page === currentPage;

          return (
            <li key={page}>
              <button
                type="button"
                className={cn(
                  "grid size-9 place-items-center rounded-lg text-sm text-muted transition-colors hover:bg-surface-hover hover:text-ink",
                  isActive &&
                    "bg-accent font-semibold text-white hover:bg-accent hover:text-white",
                )}
                aria-current={isActive ? "page" : undefined}
                onClick={() => onChangePage(page)}
              >
                {page}
              </button>
            </li>
          );
        })}
      </ol>

      <button
        type="button"
        className="grid size-9 place-items-center rounded-lg text-sm text-muted transition-colors enabled:hover:bg-surface-hover enabled:hover:text-ink disabled:opacity-30"
        aria-label="다음 페이지"
        disabled={currentPage === totalPages}
        onClick={() => onChangePage(currentPage + 1)}
      >
        <span
          className="icon size-5 [--icon-url:url('/icons/chevron-right.svg')]"
          aria-hidden="true"
        />
      </button>
    </nav>
  );
}
