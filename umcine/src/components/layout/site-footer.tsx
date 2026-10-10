export function SiteFooter() {
  return (
    <footer className="flex w-full flex-wrap items-center justify-end gap-2 border-t border-border-default bg-bg-surface px-4 py-4 sm:px-10 lg:px-20">
      {/* 제공된 TMDB 로고는 가로형 워드마크라 높이만 맞추고 비율을 유지 */}
      <img className="h-5 w-auto" src="/images/logos/tmdb-logo.svg" alt="TMDB" />
      <p className="text-xs text-text-secondary">
        This product uses the TMDB API but is not endorsed or certified by{" "}
        <a
          className="underline"
          href="https://www.themoviedb.org/?language=ko"
          target="_blank"
          rel="noreferrer"
        >
          TMDB
        </a>
        .
      </p>
    </footer>
  );
}
