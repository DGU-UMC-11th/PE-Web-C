interface PaginationProps {
  currentPage: number;
  onPageChange: (page: number) => void;
}

export default function Pagination({
  currentPage,
  onPageChange,
}: PaginationProps) {
  const pages = [1, 2, 3, 4, 5];

  return (
    <div className="pagination">
      <button
        type="button"
        className="pagination-arrow"
        disabled={currentPage === 1}
        onClick={() => onPageChange(currentPage - 1)}
      >
        <img src="/icons/chevron-left.svg" alt="이전 페이지" />
      </button>

    {pages.map((page) => (
      <button
        type="button"
        key={page}
        aria-current={currentPage === page ? "page" : undefined}
        className={`page-button ${
          currentPage === page ? "active" : ""
        }`}
        onClick={() => onPageChange(page)}
      >
        {page}
      </button>
    ))}

      <button
        type="button"
        className="pagination-arrow"
        disabled={currentPage === 5}
        onClick={() => onPageChange(currentPage + 1)}
      >
        <img src="/icons/chevron-right.svg" alt="다음 페이지" />
      </button>
    </div>
  );
}