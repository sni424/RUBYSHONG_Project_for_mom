import { Bell, Menu, User } from 'lucide-react';

interface AdminHeaderProps {
  onMenuClick: () => void;
}

const AdminHeader = ({ onMenuClick }: AdminHeaderProps) => {
  return (
    <header className="sticky top-0 z-30 flex h-16 items-center justify-between border-b border-slate-200 bg-white/90 px-5 backdrop-blur sm:px-8 lg:px-10">
      <button
        type="button"
        onClick={onMenuClick}
        className="flex h-10 w-10 items-center justify-center rounded-xl border border-slate-200 text-slate-700 lg:hidden"
      >
        <Menu size={20} />
      </button>

      <div className="hidden lg:block">
        <p className="text-sm text-slate-500">RUBYSHONG ADMIN</p>
      </div>

      <div className="ml-auto flex items-center gap-3">
        <button className="relative flex h-10 w-10 items-center justify-center rounded-xl border border-slate-200 text-slate-700">
          <Bell size={18} />
          <span className="absolute right-2 top-2 h-2 w-2 rounded-full bg-red-500" />
        </button>

        <div className="flex items-center gap-2 rounded-xl border border-slate-200 px-3 py-2">
          <div className="flex h-8 w-8 items-center justify-center rounded-full bg-slate-100">
            <User size={17} />
          </div>
          <span className="hidden text-sm font-medium sm:block">admin</span>
        </div>
      </div>
    </header>
  );
};

export default AdminHeader;
