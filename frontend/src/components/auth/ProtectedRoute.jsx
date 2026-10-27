import { Navigate, Outlet } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';

const ProtectedRoute = ({ children, allowedRoles }) => {
  const { user } = useAuth();
  const isAuth = localStorage.getItem('isAuthenticated') === 'true';

  if (!isAuth) {
    return <Navigate to="/admin/login" replace />;
  }

  if (allowedRoles && user?.rol && !allowedRoles.includes(user?.rol)) {
    switch(user?.rol) {
      case 'COCINERO':
        return <Navigate to="/cocina" replace />;
      case 'CAJERO':
        return <Navigate to="/caja" replace />;
      case 'TOTEM':
      case 'CLIENTE':
        return <Navigate to="/cliente" replace />;
      default:
        return <Navigate to="/admin" replace />;
    }
  }

  return children ? children : <Outlet />;
};

export default ProtectedRoute;
