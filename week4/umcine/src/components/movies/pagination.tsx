import { cn } from "../../utils/cn";

interface PaginationProps {
  currentPage: number;
  totalPages: number;
  onPageChange: (page: number) => void;
}

export default function Pagination({ currentPage, totalPages, onPageChange }: PaginationProps) {
  const pages = Array.from({ length: totalPages }, (_, index) => index + 1);
  const buttonClass = "flex size-9 items-center justify-center rounded-[7px] text-sm text-[#656a73] hover:bg-[#e9ebef] disabled:cursor-default disabled:opacity-30";

  return (
    <nav aria-label="영화 목록 페이지" className="mt-10 flex items-center justify-center gap-1">
      <button type="button" aria-label="이전 페이지" className={buttonClass} disabled={currentPage <= 1} onClick={() => onPageChange(currentPage - 1)}>
        <img className="size-[18px]" src="/icons/chevron-left.svg" alt="" />
      </button>
      {pages.map((page) => (
        <button type="button" key={page} aria-label={page + "페이지"} aria-current={currentPage === page ? "page" : undefined} className={cn(buttonClass, currentPage === page && "bg-[#191b20] font-bold text-white hover:bg-[#191b20]")} onClick={() => onPageChange(page)}>{page}</button>
      ))}
      <button type="button" aria-label="다음 페이지" className={buttonClass} disabled={currentPage >= totalPages} onClick={() => onPageChange(currentPage + 1)}>
        <img className="size-[18px]" src="/icons/chevron-right.svg" alt="" />
      </button>
    </nav>
  );
}
