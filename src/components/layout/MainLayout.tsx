import Header from './Header';
import Footer from './Footer';
import { Outlet } from 'react-router';

const MainLayout = () => {
  return (
    <div className="min-h-screen bg-background text-text-primary">
      <Header />
      <main>
        <Outlet />
      </main>
      <Footer />
    </div>
  );
};

export default MainLayout;
