import { FaInstagram } from 'react-icons/fa6';
import { AUTH_NAV_ITEMS, NAV_ITEMS } from '@/constants/navigation';
import { Link } from 'react-router';
import { useAuthStore } from '@/stores/authStore';

const DesktopNav = () => {
  // 로그인 상태와 로그아웃 함수 가져오기
  const { isLoggedIn, logout } = useAuthStore();

  return (
    <div className="hidden w-full grid-cols-[1fr_auto_1fr] items-center lg:grid">
      {/* 왼쪽 메인 메뉴 */}
      <nav className="flex items-center gap-12 text-xs tracking-[0.18em] text-text-secondary">
        {NAV_ITEMS.slice(0, 3).map((item) => (
          <a key={item.label} href={item.href} className="transition hover:text-accent">
            {item.label}
          </a>
        ))}
      </nav>

      {/* 가운데 로고 */}
      <Link to="/" className="px-12 text-center">
        <h1 className="font-display text-3xl tracking-[0.34em] text-text-primary">RUBYSHONG</h1>

        <p className="mt-1 text-xs tracking-[0.45em] text-text-muted">루비숑</p>
      </Link>

      {/* 오른쪽 메뉴 영역 */}
      <div className="flex items-center justify-end gap-10">
        {/* 오른쪽 메인 메뉴 */}
        <nav className="flex items-center gap-10 text-xs tracking-[0.18em] text-text-secondary">
          {NAV_ITEMS.slice(3).map((item) => (
            <Link
              key={`DeskTopNav_${item.label}`}
              to={item.href}
              className="transition hover:text-accent"
            >
              {item.label}
            </Link>
          ))}
        </nav>

        {/* 로그인/회원 유틸 메뉴 */}
        <nav className="flex items-center gap-5 text-[11px] tracking-[0.18em] text-text-muted">
          {isLoggedIn ? (
            <>
              <Link to="/mypage" className="whitespace-nowrap transition hover:text-accent">
                ACCOUNT
              </Link>

              <button
                type="button"
                onClick={logout}
                className="whitespace-nowrap transition   cursor-pointer hover:text-accent"
              >
                LOGOUT
              </button>
            </>
          ) : (
            AUTH_NAV_ITEMS.map((item) => (
              <Link
                key={`DesktopAuthNav_${item.label}`}
                to={item.href}
                className="whitespace-nowrap transition   cursor-pointer hover:text-accent"
              >
                {item.label}
              </Link>
            ))
          )}

          <a
            href="https://www.instagram.com/naver_official/"
            target="_blank"
            rel="noreferrer"
            aria-label="Instagram"
            className="transition hover:text-accent"
          >
            <FaInstagram size={14} />
          </a>
        </nav>
      </div>
    </div>
  );
};

export default DesktopNav;
