import { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";

import Icon from "./icon";
import "../../styles/header.css";

type LoginRole = "USER" | "COMPANY" | "STORE" | "ADMIN";

type LoginUser = {
  userId: number;
  loginId: string;
  name: string;
  role: LoginRole;
};

const ROLE_LABEL: Record<LoginRole, string> = {
  USER: "일반회원",
  COMPANY: "기업회원",
  STORE: "업체회원",
  ADMIN: "관리자",
};

const MENUS = [
  { label: "채용공고", path: "/jobs" },
  { label: "인재정보", path: "/talents" },
  { label: "업체정보", path: "/stores" },
  { label: "커뮤니티", path: "/community" },
];

function getLoginUser(): LoginUser | null {
  try {
    const savedUser = sessionStorage.getItem("sailingUser");
    return savedUser ? (JSON.parse(savedUser) as LoginUser) : null;
  } catch {
    return null;
  }
}

function getMyPagePath(role: LoginRole): string {
  switch (role) {
    case "USER":
      return "/mypage/personal";
    case "COMPANY":
      return "/mypage/company";
    case "STORE":
      return "/mypage/store";
    case "ADMIN":
      return "/users";
  }
}

export default function Header() {
  const navigate = useNavigate();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [user, setUser] = useState<LoginUser | null>(getLoginUser);

  useEffect(() => {
    const refreshUser = () => setUser(getLoginUser());
    window.addEventListener("sailingAuthChange", refreshUser);
    return () => window.removeEventListener("sailingAuthChange", refreshUser);
  }, []);

  const handleLogout = () => {
    sessionStorage.removeItem("sailingUser");
    window.dispatchEvent(new Event("sailingAuthChange"));
    navigate("/", { replace: true });
  };

  const renderMenus = () => MENUS.map((menu) => (
    <Link key={menu.path} to={menu.path} onClick={() => setIsMobileMenuOpen(false)}>
      {menu.label}
    </Link>
  ));

  return (
    <header className="header">
      <div className="header-inner container">
        <Link to="/" className="brand" aria-label="SAILING 홈">
          <span className="brand-logo"><Icon name="ship" size={20} /></span>
          <span className="brand-name">SAILING</span>
        </Link>

        <nav className="header-nav" aria-label="주요 메뉴">{renderMenus()}</nav>

        <div className="header-actions">
          {user ? (
            <>
              <button
                type="button"
                className="header-profile-button"
                onClick={() => navigate(getMyPagePath(user.role))}
                aria-label="마이페이지로 이동"
              >
                <span className="header-profile-avatar"><Icon name="user" size={18} /></span>
                <span className="header-profile-text">
                  <span className="header-profile-role">{ROLE_LABEL[user.role]}</span>
                  <strong>{user.name || user.loginId}</strong>
                </span>
                <Icon name="chevron" size={16} />
              </button>
              <button type="button" className="button-logout" onClick={handleLogout}>로그아웃</button>
            </>
          ) : (
            <>
              <Link to="/login" className="header-login">로그인</Link>
              <Link to="/signup" className="button button--outline">회원가입</Link>
            </>
          )}
          <Link to="/jobs/new" className="button button--primary">구인공고 등록</Link>
        </div>

        <button
          type="button"
          className="menu-btn"
          onClick={() => setIsMobileMenuOpen((open) => !open)}
          aria-label={isMobileMenuOpen ? "메뉴 닫기" : "메뉴 열기"}
          aria-expanded={isMobileMenuOpen}
        >
          <Icon name={isMobileMenuOpen ? "x" : "menu"} size={25} />
        </button>
      </div>

      {isMobileMenuOpen && (
        <nav className="mobile-menu" aria-label="모바일 메뉴">
          {renderMenus()}
          {user ? (
            <>
              <Link to={getMyPagePath(user.role)} onClick={() => setIsMobileMenuOpen(false)}>마이페이지</Link>
              <button type="button" className="button button--outline" onClick={handleLogout}>로그아웃</button>
            </>
          ) : (
            <>
              <Link to="/login" onClick={() => setIsMobileMenuOpen(false)}>로그인</Link>
              <Link to="/signup" onClick={() => setIsMobileMenuOpen(false)}>회원가입</Link>
            </>
          )}
          <Link to="/jobs/new" className="button button--primary" onClick={() => setIsMobileMenuOpen(false)}>
            구인공고 등록
          </Link>
        </nav>
      )}
    </header>
  );
}
