import { cn } from "../../utils/cn";

interface PaginationProps {
  page: number;
  totalPages: number;
  onPageChange: (page: number) => void;
}

function Pagination({ page, totalPages, onPageChange }: PaginationProps) {
  const safeTotalPages = Math.max(1, totalPages);

  const visibleCount = Math.min(5, safeTotalPages);

  const startPage = Math.max(
    1,
    Math.min(page - 2, safeTotalPages - visibleCount + 1),
  );

  const pages = Array.from(
    {
      length: visibleCount,
    },
    (_, index) => startPage + index,
  );

  return (
    <nav
      className="flex h-9 w-full items-center justify-center"
      aria-label="페이지네이션"
    >
      <div className="flex gap-1">
        {pages.map((pageNumber) => (
          <button
            key={pageNumber}
            type="button"
            className={cn(
              "h-9 w-9 cursor-pointer rounded-[7px] border-none bg-transparent px-[6px] py-px font-[inherit] text-[13px] font-bold leading-none text-[#606774]",
              pageNumber === page && "bg-[#17191e] text-white",
            )}
            aria-current={pageNumber === page ? "page" : undefined}
            onClick={() => onPageChange(pageNumber)}
          >
            {pageNumber}
          </button>
        ))}
      </div>
    </nav>
  );
}

export default Pagination;
