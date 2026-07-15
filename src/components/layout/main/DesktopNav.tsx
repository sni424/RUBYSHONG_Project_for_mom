import { FaInstagram } from 'react-icons/fa6';
import { AUTH_NAV_ITEMS, NAV_ITEMS } from '@/constants/navigation';
import { Link } from 'react-router';

const DesktopNav = () => {
  return (
    <div className="hidden w-full items-center lg:flex">
      <nav className="hidden items-center gap-12 text-xs tracking-[0.18em] text-text-secondary lg:flex">
        {NAV_ITEMS.slice(0, 3).map((item) => (
          <a key={item.label} href={item.href} className="transition hover:text-accent">
            {item.label}
          </a>
        ))}
      </nav>

      <a href="/" className="absolute left-1/2 -translate-x-1/2 text-center">
        <h1 className="font-display text-3xl tracking-[0.34em] text-text-primary">RUBYSHONG</h1>

        <p className="mt-1 text-xs tracking-[0.45em] text-text-muted">루비숑</p>
      </a>

      <nav className="ml-auto hidden items-center gap-8 text-xs tracking-[0.18em] text-text-secondary lg:flex">
        {NAV_ITEMS.slice(3).map((item) => (
          <Link
            key={`DeskTopNav_${item.label}`}
            to={item.href}
            className="transition hover:text-accent"
          >
            {item.label}
          </Link>
        ))}

        <span className="h-3 w-px bg-border" />

        <div className="flex items-center gap-5">
          {AUTH_NAV_ITEMS.map((item) => (
            <Link
              key={`DesktopAuthNav_${item.label}`}
              to={item.href}
              className="text-[11px] tracking-[0.2em] text-text-muted transition hover:text-accent"
            >
              {item.label}
            </Link>
          ))}
        </div>

        <a
          href="https://www.instagram.com/naver_official/"
          target="_blank"
          rel="noreferrer"
          aria-label="Instagram"
          className="transition hover:text-accent"
        >
          <FaInstagram size={15} />
        </a>
      </nav>
    </div>
  );
};

export default DesktopNav;
