export default function Footer() {
  return (
    <footer className="footer">
      <div className="footer__inner">
        <p>
          This product uses the TMDB API but is not endorsed or certified by
          TMDB.
        </p>
        <img
          className="footer__logo"
          src="/images/logos/tmdb-logo.svg"
          alt="TMDB"
        />
      </div>
    </footer>
  );
}
