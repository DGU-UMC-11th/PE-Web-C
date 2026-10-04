import "./header.css";

function Header() {
  return (
    <header className="header">
      <div className="header__inner">
        <a className="header__logo" href="/">
          <img src="/icons/movie.svg" alt="" className="header__logo-icon" />
          <span>UMCine</span>
        </a>

        <nav className="header__nav">
          <a href="/" className="header__nav-link header__nav-link--active">
            영화
          </a>
          <a href="/search" className="header__nav-link">
            검색
          </a>
          <a href="/me" className="header__nav-link">
            내 정보
          </a>
        </nav>

        <div className="header__actions">
          <button className="header__icon-button" aria-label="검색">
            <img src="/icons/search.svg" alt="" />
          </button>
          <button className="header__login-button">로그인</button>
        </div>
      </div>
    </header>
  );
}

export default Header;
