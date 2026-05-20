import { useState } from 'react';
import { FaInstagram } from 'react-icons/fa6';
import { HiOutlineMenuAlt4, HiOutlineX } from 'react-icons/hi';
import { NAV_ITEMS } from '@/constants/navigation';

const MobileNav = () => {
  const [isOpen, setIsOpen] = useState(false);

  const closeMenu = () => {
    setIsOpen(false);
  };

  return (
    <div className="ml-auto lg:hidden">
      <button
        type="button"
        aria-label={isOpen ? 'Close menu' : 'Open menu'}
        aria-expanded={isOpen}
        onClick={() => setIsOpen((prev) => !prev)}
        className="flex h-10 w-10 items-center justify-center text-text-primary"
      >
        {isOpen ? <HiOutlineX size={24} /> : <HiOutlineMenuAlt4 size={24} />}
      </button>

      <div
        className={`fixed left-0 top-0 z-50 h-screen w-full bg-background transition-all duration-500 ${
          isOpen ? 'pointer-events-auto opacity-100' : 'pointer-events-none opacity-0'
        }`}
      >
        <div className="flex h-20 items-center justify-between border-b border-line px-6">
          <div>
            <h1 className="font-display text-2xl tracking-[0.25em]">RUBYSHONG</h1>

            <p className="mt-1 text-[10px] tracking-[0.4em] text-text-muted">루비숑</p>
          </div>

          <button
            type="button"
            aria-label="Close menu"
            onClick={closeMenu}
            className="flex h-10 w-10 items-center justify-center"
          >
            <HiOutlineX size={24} />
          </button>
        </div>

        <nav className="flex flex-col px-6 py-10">
          {NAV_ITEMS.map((item) => (
            <a
              key={item.label}
              href={item.href}
              onClick={closeMenu}
              className="border-b border-line py-6 text-sm tracking-[0.2em] text-text-secondary transition hover:text-accent"
            >
              {item.label}
            </a>
          ))}

          <a
            href="https://www.instagram.com"
            target="_blank"
            rel="noreferrer"
            className="mt-10 flex items-center gap-3 text-sm tracking-[0.2em] text-text-secondary"
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
