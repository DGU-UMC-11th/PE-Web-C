import { useState } from "react";

function Pagination() {
  const [page, setPage] = useState(1);

  return (
    <nav className="pagination" aria-label="페이지네이션">
      <div className="page-numbers">
        {[1, 2, 3, 4, 5].map((pageNumber) => (
          <button
            key={pageNumber}
            type="button"
            className="page-button"
            aria-current={pageNumber === page ? "page" : undefined}
            onClick={() => setPage(pageNumber)}
          >
            {pageNumber}
          </button>
        ))}
      </div>
    </nav>
  );
}

export default Pagination;
