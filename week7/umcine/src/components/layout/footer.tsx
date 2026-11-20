export default function Footer() {
  return (
    <footer className="border-t border-border bg-surface">
      <div className="mx-auto flex max-w-[1440px] flex-col items-center justify-center gap-2 px-4 py-4 text-center text-xs text-secondary sm:flex-row sm:justify-end sm:px-6 sm:text-left lg:px-20">
        <img
          src="/images/logos/tmdb-mark.svg"
          alt=""
          aria-hidden="true"
          className="size-6"
        />
        <p>
          This product uses the TMDB API but is not endorsed or certified by{" "}
          <a
            href="https://www.themoviedb.org/?language=ko"
            target="_blank"
            rel="noreferrer"
            className="underline"
          >
            TMDB
          </a>
          .
        </p>
      </div>
    </footer>
  );
}
