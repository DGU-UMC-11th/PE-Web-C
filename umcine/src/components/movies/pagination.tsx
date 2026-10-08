function Pagination() {
  return (
    <nav aria-label="페이지 이동" className="mt-10 flex items-center justify-center gap-2 text-sm">
      <button
        type="button"
        disabled
        aria-label="이전 페이지"
        className="flex size-8 items-center justify-center rounded-md text-gray-500 hover:bg-gray-100 disabled:text-gray-300 disabled:hover:bg-transparent"
      >
        ‹
      </button>
      <button
        type="button"
        aria-current="page"
        className="flex size-8 items-center justify-center rounded-md bg-gray-900 font-semibold text-white"
      >
        1
      </button>
      <button
        type="button"
        aria-label="다음 페이지"
        className="flex size-8 items-center justify-center rounded-md text-gray-500 hover:bg-gray-100"
      >
        ›
      </button>
    </nav>
  );
}

export default Pagination;