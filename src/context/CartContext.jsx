// importaciones
import { createContext, useContext, useState, useEffect } from 'react';
import { cartService } from '../services/cartService';
import { useAuth } from './AuthContext';
import toast from 'react-hot-toast';

const CartContext = createContext(null);

// Proveedor global del carrito que gestiona items, totales y sincronización con el servidor
export const CartProvider = ({ children }) => {
  const [cartItems, setCartItems] = useState([]);
  const [loading, setLoading] = useState(false);
  const { isAuthenticated } = useAuth();

  // Obtiene los items del carrito desde el servidor; limpia el estado si no hay sesión activa
  const fetchCart = async () => {
    if (!isAuthenticated) {
      setCartItems([]);
      return;
    }
    
    try {
      setLoading(true);
      const data = await cartService.getAll();
      setCartItems(data);
    } catch (error) {
      console.error('Error fetching cart:', error);
      toast.error('Error al cargar el carrito');
    } finally {
      setLoading(false);
    }
  };

  // Recarga el carrito cada vez que cambia el estado de autenticación
  useEffect(() => {
    fetchCart();
  }, [isAuthenticated]);

const addToCart = async (productId, quantity = 1, sizeId = null) => {
    try {
      await cartService.addToCart({ productId, quantity, sizeId });
      await fetchCart();
      toast.success('Producto agregado al carrito');
    } catch (error) {
      console.error('Error adding to cart:', error);
      toast.error('Error al agregar al carrito');
    }
  };

  const updateCartItem = async (id, quantity) => {
    try {
      await cartService.update(id, quantity);
      await fetchCart();
      toast.success('Carrito actualizado');
    } catch (error) {
      console.error('Error updating cart:', error);
      toast.error('Error al actualizar el carrito');
    }
  };

  const removeFromCart = async (id) => {
    try {
      await cartService.remove(id);
      await fetchCart();
      toast.success('Producto eliminado del carrito');
    } catch (error) {
      console.error('Error removing from cart:', error);
      toast.error('Error al eliminar del carrito');
    }
  };


  // Calcula el precio total sumando precio x cantidad de cada item
  const getCartTotal = () => {
    return cartItems.reduce((total, item) => {
      return total + (parseFloat(item.product?.price || 0) * item.quantity);
    }, 0);
  };

  // Retorna la cantidad total de unidades en el carrito
  const getCartCount = () => {
    return cartItems.reduce((count, item) => count + item.quantity, 0);
  };

  const value = {
    cartItems,
    loading,
    addToCart,
    updateCartItem,
    removeFromCart,
    fetchCart,
    getCartTotal,
    getCartCount,
  };

  return <CartContext.Provider value={value}>{children}</CartContext.Provider>;
};

// Hook para consumir el contexto del carrito; lanza error si se usa fuera del proveedor
export const useCart = () => {
  const context = useContext(CartContext);
  if (!context) {
    throw new Error('useCart must be used within a CartProvider');
  }
  return context;
};
