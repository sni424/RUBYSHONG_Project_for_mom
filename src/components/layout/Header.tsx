import DesktopNav from '@/components/layout/DesktopNav';
import MobileNav from '@/components/layout/MobileNav';

const Header = () => {
  return (
    <div className="relative mx-auto flex h-20 max-w-7xl items-center justify-between px-5 md:h-24 md:px-10">
      <DesktopNav />
      <MobileNav />
    </div>
  );
};

export default Header;
