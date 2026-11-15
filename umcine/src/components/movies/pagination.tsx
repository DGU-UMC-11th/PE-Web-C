type PaginationProps = {
  page: number;
  totalPages: number;
  onPageChange: (nextPage: number) => void;
};

const MAX_VISIBLE = 5;
const TMDB_MAX_PAGE = 500;

function Pagination({ page, totalPages, onPageChange }: PaginationProps) {
  const lastPage = Math.min(totalPages, TMDB_MAX_PAGE);
  if (lastPage <= 1) return null;

  const start = Math.max(1, Math.min(page - 2, lastPage - MAX_VISIBLE + 1));
  const end = Math.min(lastPage, start + MAX_VISIBLE - 1);
  const pages = Array.from({ length: end - start + 1 }, (_, i) => start + i);

  return (
    <nav
      aria-label="페이지 이동"
      className="mt-10 flex items-center justify-center gap-2 text-sm"
    >
      <button
        type="button"
        disabled={page <= 1}
        onClick={() => onPageChange(page - 1)}
        aria-label="이전 페이지"
        className="flex size-8 items-center justify-center rounded-md text-gray-500 hover:bg-gray-100 disabled:text-gray-300 disabled:hover:bg-transparent"
      >
        ‹
      </button>

      {pages.map((p) => (
        <button
          key={p}
          type="button"
          onClick={() => onPageChange(p)}
          aria-current={p === page ? "page" : undefined}
          className={
            p === page
              ? "flex size-8 items-center justify-center rounded-md bg-gray-900 font-semibold text-white"
              : "flex size-8 items-center justify-center rounded-md text-gray-500 hover:bg-gray-100"
          }
        >
          {p}
        </button>
      ))}

      <button
        type="button"
        disabled={page >= lastPage}
        onClick={() => onPageChange(page + 1)}
        aria-label="다음 페이지"
        className="flex size-8 items-center justify-center rounded-md text-gray-500 hover:bg-gray-100 disabled:text-gray-300 disabled:hover:bg-transparent"
      >
        ›
      </button>
    </nav>
  );
}

export default Pagination;
