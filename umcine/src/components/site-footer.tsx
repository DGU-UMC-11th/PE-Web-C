import "./site-footer.css";

export default function SiteFooter() {
  return (
    <footer className="site-footer">
      <img className="site-footer__logo" src="/images/logos/tmdb-logo.svg" alt="TMDB" />
      <p className="site-footer__text">
        This product uses the TMDB API but is not endorsed or certified by{" "}
        <a href="https://www.themoviedb.org/?language=ko" target="_blank" rel="noreferrer">
          TMDB
        </a>
        .
      </p>
    </footer>
  );
}
