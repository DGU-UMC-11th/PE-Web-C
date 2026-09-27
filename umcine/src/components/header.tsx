function Header() {
  return (
    <header className="header">
      <div className="header-left">
        <div className="logo-area">
          <img className="logo-icon" src="/icons/movie.svg" alt="" />

          <span className="logo-text">UMCine</span>
        </div>

        <nav className="nav">
          <span className="nav-active">영화</span>
          <span>검색</span>
          <span>내 정보</span>
        </nav>
      </div>

      <div className="header-actions">
        <button className="search-button" type="button" aria-label="검색">
          <img src="/icons/search.svg" alt="" />
        </button>

        <button className="login-button" type="button">
          로그인
        </button>
      </div>
    </header>
  );
}

export default Header;
