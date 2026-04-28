// importaciones
import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { ShoppingCart, User, LogOut, Menu, X } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { useCart } from '../context/CartContext';

// Barra de navegación principal de la aplicación
const Navbar = () => {
  const { user, isAuthenticated, logout } = useAuth();
  const { getCartCount } = useCart();
  const navigate = useNavigate();
  const [menuOpen, setMenuOpen] = useState(false);

  const handleLogout = () => {
    logout();
    navigate('/login');
    setMenuOpen(false);
  };

  const closeMenu = () => setMenuOpen(false);

  return (
    <nav className="bg-white shadow-md sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">

          {/* Logo */}
          <Link to="/" className="flex items-center space-x-2" onClick={closeMenu}>
            <img src="/imageLogo.png" alt="SuperExtraLogo" className="h-15 w-15 text-primary-600" />
            <span className="text-xl font-bold text-gray-900">Super Extra</span>
          </Link>

          {/* Desktop - Enlaces de navegación */}
          <div className="hidden md:flex items-center space-x-6">
            <Link to="/" className="text-gray-700 hover:text-primary-600 transition-colors">
              Productos
            </Link>

            {isAuthenticated && (
              <>
                <Link to="/purchases" className="text-gray-700 hover:text-primary-600 transition-colors">
                  Mis Compras
                </Link>

                {user?.rol === 'admin' && (
                  <div className="flex items-center space-x-4">
                    <Link to="/admin/products" className="text-gray-700 hover:text-primary-600 transition-colors">
                      Admin Productos
                    </Link>
                    <Link to="/admin/categories" className="text-gray-700 hover:text-primary-600 transition-colors">
                      Admin Categorías
                    </Link>
                    <Link to="/admin/images" className="text-gray-700 hover:text-primary-600 transition-colors">
                      Admin Imágenes
                    </Link>
                  </div>
                )}

                {/* Carrito */}
                <Link to="/cart" className="relative text-gray-700 hover:text-primary-600 transition-colors">
                  <ShoppingCart className="h-6 w-6" />
                  {getCartCount() > 0 && (
                    <span className="absolute -top-2 -right-2 bg-red-500 text-white text-xs rounded-full h-5 w-5 flex items-center justify-center">
                      {getCartCount()}
                    </span>
                  )}
                </Link>

                {/* Usuario */}
                <div className="flex items-center space-x-3">
                  <div className="flex items-center space-x-2 text-gray-700">
                    <User className="h-5 w-5" />
                    <span className="text-sm">{user?.userName}</span>
                  </div>
                  <button onClick={handleLogout} className="text-gray-700 hover:text-red-600 transition-colors">
                    <LogOut className="h-5 w-5" />
                  </button>
                </div>
              </>
            )}

            {!isAuthenticated && (
              <div className="flex items-center space-x-4">
                <Link to="/login" className="text-gray-700 hover:text-primary-600 transition-colors">
                  Iniciar Sesión
                </Link>
                <Link to="/register" className="btn-primary">
                  Registrarse
                </Link>
              </div>
            )}
          </div>

          {/* Mobile - Carrito y botón hamburguesa */}
          <div className="flex md:hidden items-center space-x-3">
            {isAuthenticated && (
              <Link to="/cart" className="relative text-gray-700 hover:text-primary-600 transition-colors">
                <ShoppingCart className="h-6 w-6" />
                {getCartCount() > 0 && (
                  <span className="absolute -top-2 -right-2 bg-red-500 text-white text-xs rounded-full h-5 w-5 flex items-center justify-center">
                    {getCartCount()}
                  </span>
                )}
              </Link>
            )}
            <button
              onClick={() => setMenuOpen(!menuOpen)}
              className="text-gray-700 hover:text-primary-600 transition-colors"
            >
              {menuOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile - Menú desplegable */}
      {menuOpen && (
        <div className="md:hidden bg-white border-t border-gray-200 px-4 py-4 space-y-3">
          <Link to="/" onClick={closeMenu} className="block text-gray-700 hover:text-primary-600 transition-colors py-2">
            Productos
          </Link>

          {isAuthenticated && (
            <>
              <Link to="/purchases" onClick={closeMenu} className="block text-gray-700 hover:text-primary-600 transition-colors py-2">
                Mis Compras
              </Link>

              {user?.rol === 'admin' && (
                <>
                  <Link to="/admin/products" onClick={closeMenu} className="block text-gray-700 hover:text-primary-600 transition-colors py-2">
                    Admin Productos
                  </Link>
                  <Link to="/admin/categories" onClick={closeMenu} className="block text-gray-700 hover:text-primary-600 transition-colors py-2">
                    Admin Categorías
                  </Link>
                  <Link to="/admin/images" onClick={closeMenu} className="block text-gray-700 hover:text-primary-600 transition-colors py-2">
                    Admin Imágenes
                  </Link>
                </>
              )}

              {/* Usuario y logout */}
              <div className="flex items-center justify-between py-2 border-t border-gray-100 mt-2">
                <div className="flex items-center space-x-2 text-gray-700">
                  <User className="h-5 w-5" />
                  <span className="text-sm font-medium">{user?.userName}</span>
                </div>
                <button onClick={handleLogout} className="text-gray-700 hover:text-red-600 transition-colors">
                  <LogOut className="h-5 w-5" />
                </button>
              </div>
            </>
          )}

          {!isAuthenticated && (
            <div className="space-y-3 pt-2">
              <Link to="/login" onClick={closeMenu} className="block text-gray-700 hover:text-primary-600 transition-colors py-2">
                Iniciar Sesión
              </Link>
              <Link to="/register" onClick={closeMenu} className="block btn-primary text-center">
                Registrarse
              </Link>
            </div>
          )}
        </div>
      )}
    </nav>
  );
};

export default Navbar;