import { Navigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

// Proteger rutas que solo puede ver un administrador
const ProtectedAdminRoute = ({ children }) => {
  const { user, isAuthenticated } = useAuth();

  if (!isAuthenticated) {
    return <Navigate to="/login" replace />;
  }

  if (user?.rol !== 'admin') {
    return <Navigate to="/" replace />;
  }

  return children;
};

export default ProtectedAdminRoute;