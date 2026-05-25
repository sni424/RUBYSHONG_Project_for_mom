import { useState } from 'react';
import { Outlet } from 'react-router';
import AdminHeader from '@/components/layout/admin/AdminHeader';
import AdminSidebar from '@/components/layout/admin/AdminSidebar';

const AdminLayout = () => {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);

  return (
    <div className="min-h-screen bg-[#f7f8fb] text-slate-900">
      <AdminSidebar isOpen={isSidebarOpen} onClose={() => setIsSidebarOpen(false)} />

      <div className="lg:pl-64">
        <AdminHeader onMenuClick={() => setIsSidebarOpen(true)} />

        <main className="px-5 py-6 sm:px-8 lg:px-10">
          <Outlet />
        </main>
      </div>
    </div>
  );
};

export default AdminLayout;
