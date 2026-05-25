import {
  LayoutDashboard,
  Package,
  ShoppingCart,
  Users,
  Star,
  MessageCircle,
  BarChart3,
  Settings,
  LogOut,
  X,
} from 'lucide-react';
import { NavLink, useNavigate } from 'react-router';

interface AdminSidebarProps {
  isOpen: boolean;
  onClose: () => void;
}

const navItems = [
  { label: '대시보드', path: '/admin', icon: LayoutDashboard },
  { label: '상품 관리', path: '/admin/products', icon: Package },
  { label: '주문 관리', path: '/admin/orders', icon: ShoppingCart },
  { label: '고객 관리', path: '/admin/customers', icon: Users },
  { label: '리뷰 관리', path: '/admin/reviews', icon: Star },
  { label: '문의 관리', path: '/admin/inquiries', icon: MessageCircle },
  { label: '통계', path: '/admin/analytics', icon: BarChart3 },
  { label: '설정', path: '/admin/settings', icon: Settings },
];

const AdminSidebar = ({ isOpen, onClose }: AdminSidebarProps) => {
  const navigate = useNavigate();

  const handleLogout = () => {
    localStorage.removeItem('adminToken');
    navigate('/admin/login');
  };
  return (
    <>
      <div
        onClick={onClose}
        className={`fixed inset-0 z-40 bg-black/40 transition lg:hidden ${
          isOpen ? 'opacity-100' : 'pointer-events-none opacity-0'
        }`}
      />

      <aside
        className={`fixed left-0 top-0 z-50 flex h-screen w-64 flex-col bg-slate-950 px-4 py-6 text-white transition-transform duration-300 lg:z-40 lg:translate-x-0 ${
          isOpen ? 'translate-x-0' : '-translate-x-full'
        }`}
      >
        <button
          type="button"
          onClick={onClose}
          className="absolute right-4 top-4 text-slate-300 lg:hidden"
        >
          <X size={22} />
        </button>

        <div className="mb-10 px-2">
          <h1 className="text-2xl font-bold tracking-wide">RUBYSHONG</h1>
          <p className="mt-1 text-xs tracking-[0.35em] text-slate-300">ADMIN</p>
        </div>

        <nav className="flex flex-1 flex-col gap-2">
          {navItems.map((item) => {
            const Icon = item.icon;

            return (
              <NavLink
                key={item.path}
                to={item.path}
                end={item.path === '/admin'}
                onClick={onClose}
                className={({ isActive }) =>
                  `flex items-center gap-3 rounded-xl px-4 py-3 text-sm font-medium transition ${
                    isActive
                      ? 'bg-violet-600 text-white shadow-lg shadow-violet-900/30'
                      : 'text-slate-300 hover:bg-white/10 hover:text-white'
                  }`
                }
              >
                <Icon size={19} />
                {item.label}
              </NavLink>
            );
          })}
        </nav>

        <button
          type="button"
          onClick={handleLogout}
          className="flex items-center gap-3 rounded-xl px-4 py-3 text-sm font-medium text-slate-300 transition hover:bg-white/10 hover:text-white cursor-pointer"
        >
          <LogOut size={19} />
          로그아웃
        </button>
      </aside>
    </>
  );
};

export default AdminSidebar;
