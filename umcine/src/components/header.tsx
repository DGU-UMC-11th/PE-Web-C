import "./header.css";

const NAV_ITEMS = [
  { label: "영화", isActive: true },
  { label: "검색", isActive: false },
  { label: "내 정보", isActive: false },
];

export default function Header() {
  return (
    <header className="header">
      <div className="header__brand-row">
        <div className="header__brand">
          <span className="header__mark">
            <img src="/icons/movie.svg" alt="" width={24} height={24} />
          </span>
          <span className="header__logo-text">UMCine</span>
        </div>
        <nav className="header__nav" aria-label="주요 메뉴">
          {NAV_ITEMS.map((item) => (
            <a
              key={item.label}
              href="#"
              className={
                item.isActive ? "header__nav-link header__nav-link--active" : "header__nav-link"
              }
              aria-current={item.isActive ? "page" : undefined}
            >
              {item.label}
            </a>
          ))}
        </nav>
      </div>

      <div className="header__actions">
        <button type="button" className="header__search" aria-label="영화 검색">
          <img src="/icons/search.svg" alt="" width={24} height={24} />
        </button>
        <button type="button" className="header__login">
          로그인
        </button>
      </div>
    </header>
  );
}
