import { useState } from "react";
import { cn } from "../../utils/cn";

function Pagination() {
  const [page, setPage] = useState(1);

  return (
    <nav
      className="flex h-9 w-full items-center justify-center"
      aria-label="페이지네이션"
    >
      <div className="flex gap-1">
        {[1, 2, 3, 4, 5].map((pageNumber) => (
          <button
            key={pageNumber}
            type="button"
            className={cn(
              "h-9 w-9 cursor-pointer rounded-[7px] border-none bg-transparent px-[6px] py-px font-[inherit] text-[13px] font-bold leading-none text-[#606774]",
              pageNumber === page && "bg-[#17191e] text-white",
            )}
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
