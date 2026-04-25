// importaciones
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { Toaster } from 'react-hot-toast';
import { AuthProvider } from './context/AuthContext';
import { CartProvider } from './context/CartContext';
import Navbar from './components/Navbar';
import ProtectedRoute from './components/ProtectedRoute';
import ProtectedAdminRoute from './components/ProtectedAdminRoute';
import Products from './pages/Products';
import ProductDetail from './pages/ProductDetail';
import Login from './pages/Login';
import Register from './pages/Register';
import Cart from './pages/Cart';
import Purchases from './pages/Purchases';
import AdminProducts from './pages/AdminProducts';
import AdminCategories from './pages/AdminCategories';
import { toastConfig } from './config/toastConfig';
import AdminImages from './pages/AdminImages';

// Componente raíz que configura los proveedores globales, rutas y notificaciones
function App() {
  return (
    <BrowserRouter>
    {/* AuthProvider y CartProvider envuelven la app para dar acceso global a sus contextos */}
      <AuthProvider>
        <CartProvider>
          <div className="min-h-screen bg-gray-50">
            <Navbar />
            <Routes>
               {/* Rutas públicas accesibles sin autenticación */}
              <Route path="/" element={<Products />} />
              <Route path="/products/:id" element={<ProductDetail />} />
              <Route path="/login" element={<Login />} />
              <Route path="/register" element={<Register />} />

               {/* Rutas protegidas que requieren sesión activa */}
              <Route path="/cart" element={
                <ProtectedRoute>
                  <Cart />
                </ProtectedRoute>
              }/>
              <Route path="/purchases" element={
                <ProtectedRoute>
                  <Purchases />
                </ProtectedRoute>
              }/>
              
              {/* Rutas protegidas para admin */}
              <Route path="/admin/products" element={
                <ProtectedAdminRoute>
                  <AdminProducts />
                </ProtectedAdminRoute>
              }/>
              <Route path="/admin/categories" element={
                <ProtectedAdminRoute>
                  <AdminCategories />
                </ProtectedAdminRoute>
              }/>
              <Route path="/admin/images" element={
                <ProtectedAdminRoute>
                  <AdminImages />
                </ProtectedAdminRoute>
              }/>        
            </Routes>
            <Toaster position="top-right" toastOptions={toastConfig} />
          </div>
        </CartProvider>
      </AuthProvider>
    </BrowserRouter>
  );
}

export default App;