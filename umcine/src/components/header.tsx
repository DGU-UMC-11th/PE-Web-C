// components/header.tsx
function Header() {
  return (
    <header className="header">
      <div className="logo">UMCine</div>
      <nav>
        <a href="#">영화</a>
        <a href="#">검색</a>
        <a href="#">내 정보</a>
      </nav>
      <div className="header-right">
        <button className="search-btn">🔍</button>
        <button className="login-btn">로그인</button>
      </div>
    </header>
  );
}

export default Header;