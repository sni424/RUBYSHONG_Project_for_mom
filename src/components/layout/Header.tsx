import DesktopNav from '@/components/layout/DesktopNav';
import MobileNav from '@/components/layout/MobileNav';

const Header = () => {
  return (
    <header className="fixed left-0 top-0 z-50 w-full border-b border-line bg-background/90 backdrop-blur-md">
      <div className="relative mx-auto flex h-20 max-w-7xl items-center justify-between px-5 md:h-24 md:px-10">
        <DesktopNav />
        <MobileNav />
      </div>
    </header>
  );
};

export default Header;
