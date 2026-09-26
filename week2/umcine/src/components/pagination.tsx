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
    <nav className="pagination" aria-label="페이지 이동">
      <button
        type="button"
        className="pagination__arrow pagination__arrow--prev"
        aria-label="이전 페이지"
        disabled={currentPage === 1}
        onClick={() => onChangePage(currentPage - 1)}
      >
        <span className="icon pagination__arrow-icon" aria-hidden="true" />
      </button>

      <ol className="pagination__list">
        {pages.map((page) => {
          const isActive = page === currentPage;

          return (
            <li key={page}>
              <button
                type="button"
                className={
                  isActive
                    ? "pagination__page pagination__page--active"
                    : "pagination__page"
                }
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
        className="pagination__arrow pagination__arrow--next"
        aria-label="다음 페이지"
        disabled={currentPage === totalPages}
        onClick={() => onChangePage(currentPage + 1)}
      >
        <span className="icon pagination__arrow-icon" aria-hidden="true" />
      </button>
    </nav>
  );
}
