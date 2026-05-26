import Home from '@/pages/Home';
import { Route, Routes } from 'react-router';
import Stores from '@/pages/Stores';
import About from '@/pages/About';
import AdminLogin from '@/pages/admin/AdminLogin';
import PublicOnlyRoute from '@/routes/PublicOnlyRoute';
import ProtectedRoute from '@/routes/ProtectedRoute';
import MainLayout from '@/components/layout/main/MainLayout';
import AdminLayout from '@/components/layout/admin/AdminLayout';
import AdminDashboard from '@/pages/admin/AdminDashboard';
import AdminProducts from '@/pages/admin/AdminProducts';
import CollectionPage from '@/pages/Collection';

const App = () => {
  return (
    <>
      <Routes>
        <Route element={<MainLayout />}>
          <Route path="/" element={<Home />} />
          <Route path="/collection" element={<CollectionPage />} />
          <Route path="/stores" element={<Stores />} />
          <Route path="/about" element={<About />} />
        </Route>

        <Route path="/admin">
          <Route element={<PublicOnlyRoute />}>
            <Route path="login" element={<AdminLogin />} />
          </Route>

          <Route element={<ProtectedRoute />}>
            <Route element={<AdminLayout />}>
              <Route index element={<AdminDashboard />} />
              <Route path="products" element={<AdminProducts />} />
              {/* <Route path="orders" element={<AdminOrders />} /> */}
            </Route>
          </Route>
        </Route>
      </Routes>
    </>
  );
};

export default App;
