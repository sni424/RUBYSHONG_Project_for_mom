import Home from '@/pages/Home';
import { Route, Routes } from 'react-router';
import Stores from '@/pages/Stores';
import About from '@/pages/About';
import CollectionPage from '@/pages/Collection';
import Reservation from '@/pages/Reservation';
import Contact from '@/pages/Contact';

import AdminLogin from '@/pages/admin/AdminLogin';
import PublicOnlyRoute from '@/routes/PublicOnlyRoute';
import ProtectedRoute from '@/routes/ProtectedRoute';
import MainLayout from '@/components/layout/main/MainLayout';
import AdminLayout from '@/components/layout/admin/AdminLayout';
import AdminDashboard from '@/pages/admin/AdminDashboard';
import AdminProducts from '@/pages/admin/AdminProducts';
import AdminReservations from '@/pages/admin/AdminReservations';
import AdminContact from '@/pages/admin/AdminContact';
import SignupPage from '@/pages/SignUp';
import OAuthCallbackPage from '@/pages/OAuthCallbackPage';
import LoginPage from '@/pages/Login';
import { useAuthStore } from '@/stores/authStore';

import { useEffect } from 'react';
import PrivacyPolicy from './pages/PrivacyPolicy';
import CartPage from './pages/CartPage';
import CheckoutPage from './pages/CheckoutPage';
import PaymentSuccessPage from './pages/PaymentSuccessPage';
import PaymentFailPage from './pages/PaymentFailPage';

const App = () => {
  const checkAuth = useAuthStore((state) => state.checkAuth);

  useEffect(() => {
    // 앱 첫 진입 시 로그인 상태 확인
    checkAuth();
  }, [checkAuth]);

  return (
    <>
      <Routes>
        <Route element={<MainLayout />}>
          <Route path="/" element={<Home />} />
          <Route path="/privacy" element={<PrivacyPolicy />} />
          <Route path="/login" element={<LoginPage />} />
          <Route path="/collection" element={<CollectionPage />} />
          <Route path="/stores" element={<Stores />} />
          <Route path="/about" element={<About />} />
          <Route path="/reservation" element={<Reservation />} />
          <Route path="/contact" element={<Contact />} />
          <Route path="/cart" element={<CartPage />} />
          <Route path="/checkout" element={<CheckoutPage />} />
          <Route path="/payment/success" element={<PaymentSuccessPage />} />
          <Route path="/payment/fail" element={<PaymentFailPage />} />
        </Route>

        <Route path="/oauth/callback" element={<OAuthCallbackPage />} />
        <Route path="/signup" element={<SignupPage />} />
        <Route path="/admin">
          <Route element={<PublicOnlyRoute />}>
            <Route path="login" element={<AdminLogin />} />
          </Route>

          <Route element={<ProtectedRoute />}>
            <Route element={<AdminLayout />}>
              <Route index element={<AdminDashboard />} />
              <Route path="products" element={<AdminProducts />} />
              <Route path="reservation" element={<AdminReservations />} />
              <Route path="contact" element={<AdminContact />} />
            </Route>
          </Route>
        </Route>
      </Routes>
    </>
  );
};

export default App;
