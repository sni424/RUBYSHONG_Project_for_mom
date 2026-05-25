import { useState } from 'react';
import { FaInstagram } from 'react-icons/fa6';
import { HiOutlineMenuAlt4, HiOutlineX } from 'react-icons/hi';
import { NAV_ITEMS } from '@/constants/navigation';
import Logo from '@/components/common/Logo';
import { Link } from 'react-router';

const MobileNav = () => {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <div className="flex h-16 w-full items-center justify-between px-5 lg:hidden">
      <div className="w-10" /> {/* 오른쪽 버튼과 너비 대칭 */}
      <Logo />
      <button
        type="button"
        aria-label="Open menu"
        aria-expanded={isOpen}
        onClick={() => setIsOpen(true)}
        className="flex h-10 w-10 items-center justify-center text-text-primary"
      >
        <HiOutlineMenuAlt4 size={25} />
      </button>
      <div
        className={`fixed inset-0 z-100 bg-background transition-all duration-500 ${
          isOpen
            ? 'pointer-events-auto translate-y-0 opacity-100'
            : 'pointer-events-none -translate-y-4 opacity-0'
        }`}
      >
        <div className="flex h-20 items-center justify-between border-b border-line px-5">
          <Logo />

          <button
            type="button"
            aria-label="Close menu"
            onClick={() => setIsOpen(false)}
            className="flex h-10 w-10 items-center justify-center text-text-primary"
          >
            <HiOutlineX size={25} />
          </button>
        </div>

        <nav className="flex flex-col px-5 py-8">
          {NAV_ITEMS.map((item) => (
            <Link
              key={`MobileNav_${item.label}`}
              to={item.href}
              onClick={() => setIsOpen(false)}
              className="border-b border-line py-6 text-sm tracking-[0.18em] text-text-secondary transition hover:text-accent"
            >
              {item.label}
            </Link>
          ))}

          <a
            href="https://www.instagram.com/naver_official/"
            target="_blank"
            rel="noreferrer"
            className="mt-10 flex items-center gap-3 text-sm tracking-[0.18em] text-text-secondary"
          >
            <FaInstagram size={16} />
            INSTAGRAM
          </a>
        </nav>
      </div>
    </div>
  );
};

export default MobileNav;
