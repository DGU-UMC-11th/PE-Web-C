import tmdbLogo from "../../assets/tmdb-logo.svg";

export function Footer() {
  return (
    <footer className="shrink-0 border-t border-[#dfe2e7] bg-white py-5">
      <section aria-labelledby="footer-credits" className="mx-auto flex w-[calc(100%_-_32px)] max-w-[1280px] flex-wrap items-center justify-end gap-x-3 gap-y-2 text-xs text-[#656a73] min-[701px]:w-[calc(100%_-_160px)]">
        <h2 id="footer-credits" className="font-semibold">Credits</h2>
        <a href="https://www.themoviedb.org" className="shrink-0">
          <img src={tmdbLogo} alt="The Movie Database (TMDB)" className="h-auto w-24" />
        </a>
        <p>This product uses the TMDB API but is not endorsed or certified by TMDB.</p>
      </section>
    </footer>
  );
}
