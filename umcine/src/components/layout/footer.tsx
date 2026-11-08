import tmdbLogo from "../../assets/tmdb-logo.svg";

export function Footer() {
  return (
    <footer className="border-t border-gray-200 bg-white">
      <div className="mx-auto flex max-w-6xl items-center justify-end gap-2 px-6 py-6 text-xs text-gray-500">
        <img src={tmdbLogo} alt="TMDB 로고" className="size-6" />
        <p>
          This product uses the TMDB API but is not endorsed or certified by{" "}
          <a
            href="https://www.themoviedb.org"
            target="_blank"
            rel="noreferrer"
            className="underline hover:text-gray-700"
          >
            TMDB
          </a>
          .
        </p>
      </div>
    </footer>
  );
}
