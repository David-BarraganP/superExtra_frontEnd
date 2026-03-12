// importacions
import { Navigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

// Componente que protege rutas privadas redirigiendo al login si el usuario no está autenticado
const ProtectedRoute = ({ children }) => {
  const { isAuthenticated } = useAuth();

  if (!isAuthenticated) {
    return <Navigate to="/login" replace />;
  }

  return children;
};

export default ProtectedRoute;
