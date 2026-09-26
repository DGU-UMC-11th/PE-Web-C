const NAV_ITEMS = ["영화", "인기", "내 정보"] as const;
const ACTIVE_NAV: (typeof NAV_ITEMS)[number] = "영화";

export default function Header() {
  return (
    <header className="header">
      <div className="header__inner">
        <a className="header__logo" href="/">
          <span className="icon header__logo-mark" aria-hidden="true" />
          UMCine
        </a>

        <nav aria-label="주요 메뉴">
          <ul className="header__nav">
            {NAV_ITEMS.map((item) => {
              const isActive = item === ACTIVE_NAV;

              return (
                <li key={item}>
                  <a
                    href="#"
                    className={
                      isActive
                        ? "header__link header__link--active"
                        : "header__link"
                    }
                    aria-current={isActive ? "page" : undefined}
                  >
                    {item}
                  </a>
                </li>
              );
            })}
          </ul>
        </nav>

        <div className="header__actions">
          <button
            type="button"
            className="header__search-button"
            aria-label="검색"
          >
            <span className="icon header__search" aria-hidden="true" />
          </button>

          <button type="button" className="header__login">
            로그인
          </button>
        </div>
      </div>
    </header>
  );
}
