interface MovieGridSkeletonProps {
  count?: number;
}

// 로딩 중에는 목록과 같은 격자 모양의 skeleton을 보여줘서 화면이 덜 흔들려요.
export function MovieGridSkeleton({ count = 10 }: MovieGridSkeletonProps) {
  return (
    <ul
      className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5"
      aria-label="영화 목록을 불러오는 중이에요."
      aria-busy="true"
    >
      {Array.from({ length: count }, (_, index) => (
        <li key={index} className="flex animate-pulse flex-col gap-2.5">
          <div className="aspect-[2/3] w-full rounded-xl bg-surface-hover" />
          <div className="h-4 w-3/4 rounded bg-surface-hover" />
          <div className="h-3 w-1/3 rounded bg-surface-hover" />
        </li>
      ))}
    </ul>
  );
}
