import { cn } from "../../utils/cn";

interface PaginationProps {
  currentPage: number;
  totalPages: number;
  onPageChange: (page: number) => void;
}

function Pagination({ currentPage, totalPages, onPageChange }: PaginationProps) {
  const pages = Array.from({ length: totalPages }, (_, index) => index + 1);

  return (
    <nav className="mt-10 flex items-center justify-center gap-2" aria-label="페이지네이션">
      <button
        type="button"
        className="flex h-8 w-8 items-center justify-center rounded-md border-none bg-transparent cursor-pointer disabled:opacity-30 disabled:cursor-default"
        disabled={currentPage === 1}
        aria-label="이전 페이지"
        onClick={() => onPageChange(currentPage - 1)}
      >
        <img src="/icons/chevron-left.svg" alt="" className="h-5 w-5" />
      </button>

      <ul className="flex list-none items-center gap-1 p-0 m-0">
        {pages.map((page) => (
          <li key={page}>
            <button
              type="button"
              className={cn(
                "h-8 min-w-8 rounded-md border-none bg-transparent px-2 text-sm font-semibold text-gray-500 cursor-pointer",
                page === currentPage && "bg-blue-600 text-white"
              )}
              onClick={() => onPageChange(page)}
            >
              {page}
            </button>
          </li>
        ))}
      </ul>

      <button
        type="button"
        className="flex h-8 w-8 items-center justify-center rounded-md border-none bg-transparent cursor-pointer disabled:opacity-30 disabled:cursor-default"
        disabled={currentPage === totalPages}
        aria-label="다음 페이지"
        onClick={() => onPageChange(currentPage + 1)}
      >
        <img src="/icons/chevron-right.svg" alt="" className="h-5 w-5" />
      </button>
    </nav>
  );
}

export default Pagination;
