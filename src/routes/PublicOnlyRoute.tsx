import { Navigate, Outlet } from 'react-router';

const PublicOnlyRoute = () => {
  const token = localStorage.getItem('adminToken');

  if (token) {
    return <Navigate to="/admin" replace />;
  }

  return <Outlet />;
};

export default PublicOnlyRoute;
