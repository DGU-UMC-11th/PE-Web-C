import "./pagination.css";

interface PaginationProps {
  currentPage: number;
  totalPages: number;
  onPageChange: (page: number) => void;
}

function Pagination({ currentPage, totalPages, onPageChange }: PaginationProps) {
  const pages = Array.from({ length: totalPages }, (_, index) => index + 1);

  return (
    <nav className="pagination" aria-label="페이지네이션">
      <button
        type="button"
        className="pagination__arrow"
        disabled={currentPage === 1}
        aria-label="이전 페이지"
        onClick={() => onPageChange(currentPage - 1)}
      >
        <img src="/icons/chevron-left.svg" alt="" />
      </button>

      <ul className="pagination__list">
        {pages.map((page) => (
          <li key={page}>
            <button
              type="button"
              className={
                page === currentPage
                  ? "pagination__page pagination__page--active"
                  : "pagination__page"
              }
              onClick={() => onPageChange(page)}
            >
              {page}
            </button>
          </li>
        ))}
      </ul>

      <button
        type="button"
        className="pagination__arrow"
        disabled={currentPage === totalPages}
        aria-label="다음 페이지"
        onClick={() => onPageChange(currentPage + 1)}
      >
        <img src="/icons/chevron-right.svg" alt="" />
      </button>
    </nav>
  );
}

export default Pagination;
