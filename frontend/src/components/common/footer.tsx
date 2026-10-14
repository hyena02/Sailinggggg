import { Link } from "react-router-dom";
import Icon from "./icon";
import "../../styles/footer.css";

const FOOTER_LINKS = [
  "회사소개",
  "이용약관",
  "개인정보처리방침",
  "고객센터",
  "광고문의",
  "제휴문의",
  "공지사항",
  "자주 묻는 질문",
];

export default function Footer() {
  return (
    <footer className="home-footer">
      <div className="footer-content container">
        <div className="footer-logo">
          <div>
            <Link to="/" className="footer-brand" aria-label="SAILING 홈">
              <span className="brand-logo"><Icon name="ship" size={18} /></span>
              <span className="brand-name">SAILING</span>
            </Link>
            <p>해운·선박 전문 채용 플랫폼</p>
          </div>
          <nav className="footer-links" aria-label="서비스 안내">
            {FOOTER_LINKS.map((label) => <span key={label}>{label}</span>)}
          </nav>
        </div>
        <div className="footer-bottom">
          <span>© 2026 SAILING. All rights reserved.</span>
          <span>해운·선박 분야의 인재와 기회를 연결합니다.</span>
        </div>
      </div>
    </footer>
  );
}
