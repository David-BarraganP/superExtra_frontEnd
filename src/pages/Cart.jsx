// importaciones
import { useNavigate } from 'react-router-dom';
import { useCart } from '../context/CartContext';
import { purchaseService } from '../services/purchaseService';
import { Trash2, Plus, Minus, ShoppingBag } from 'lucide-react';
import Loader from '../components/Loader';
import toast from 'react-hot-toast';
import { useState } from 'react';


// Página del carrito de compras con gestión de items y resumen del pedido
const Cart = () => {
  const navigate = useNavigate();
  const { cartItems, loading, updateCartItem, removeFromCart, getCartTotal, fetchCart } = useCart();
  const [purchasing, setPurchasing] = useState(false);

  const handleUpdateQuantity = (item, newQuantity) => {
    if (newQuantity < 1) return;
    updateCartItem(item.id, newQuantity);
  };

  const handleRemoveItem = (itemId) => {
    removeFromCart(itemId);
  };

  // Procesa la compra, actualiza el carrito y redirige al historial de compras
  const handleCheckout = async () => {
    try {
      setPurchasing(true);
      await purchaseService.create();
      toast.success('¡Compra realizada exitosamente!');
      await fetchCart(); // Refresh cart
      navigate('/purchases');
    } catch (error) {
      console.error('Error during checkout:', error);
      toast.error('Error al procesar la compra');
    } finally {
      setPurchasing(false);
    }
  };

  // Retorna la primera imagen del producto o un placeholder si no tiene
  const getProductImage = (product) => {
    if (product?.productImgs && product.productImgs.length > 0) {
      return product.productImgs[0].url;
    }
    return 'https://placehold.co/400x400?text=Sin+imagen';
  };

  if (loading) {
    return <Loader />;
  }


 // Vista cuando el carrito está vacío 
  if (cartItems.length === 0) {
    return (
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="text-center">
          <ShoppingBag className="mx-auto h-12 w-12 text-gray-400" />
          <h2 className="mt-4 text-2xl font-bold text-gray-900">
            Tu carrito está vacío
          </h2>
          <p className="mt-2 text-gray-600">
            ¡Comienza a agregar productos!
          </p>
          <button
            onClick={() => navigate('/')}
            className="mt-6 btn-primary"
          >
            Ver Productos
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <h1 className="text-3xl font-bold text-gray-900 mb-8">
        Carrito de Compras
      </h1>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Artículos del carrito*/}
        <div className="lg:col-span-2 space-y-4">
          {cartItems.map((item) => (
            <div key={item.id} className="card flex items-center space-x-4">
              {/* Imagen */}
              <img
                src={getProductImage(item.product)}
                alt={item.product?.title}
                className="w-24 h-24 object-cover rounded-lg"
              />

              {/* Info */}
              <div className="flex-1">
                <h3 className="font-semibold text-lg text-gray-900">
                  {item.product?.title}
                </h3>
                <p className="text-gray-600 text-sm">
                  {item.product?.category?.name}
                </p>
                <p className="text-primary-600 font-bold mt-1">
                  ${parseFloat(item.product?.price || 0).toFixed(2)}
                </p>
              </div>

              {/* Controles para aumentar o disminuir cantidad */}
              <div className="flex items-center space-x-3">
                <button
                  onClick={() => handleUpdateQuantity(item, item.quantity - 1)}
                  className="p-1 rounded hover:bg-gray-100"
                >
                  <Minus className="h-4 w-4" />
                </button>
                <span className="font-semibold w-8 text-center">
                  {item.quantity}
                </span>
                <button
                  onClick={() => handleUpdateQuantity(item, item.quantity + 1)}
                  className="p-1 rounded hover:bg-gray-100"
                >
                  <Plus className="h-4 w-4" />
                </button>
              </div>

              {/* Subtotal */}
              <div className="text-right">
                <p className="font-bold text-lg text-gray-900">
                  ${(parseFloat(item.product?.price || 0) * item.quantity).toFixed(2)}
                </p>
              </div>

              {/* Quitar botón */}
              <button
                onClick={() => handleRemoveItem(item.id)}
                className="text-red-600 hover:text-red-700"
              >
                <Trash2 className="h-5 w-5" />
              </button>
            </div>
          ))}
        </div>

        {/* Resumen del pedido */}
        <div className="lg:col-span-1">
          <div className="card sticky top-20">
            <h2 className="text-xl font-bold text-gray-900 mb-4">
              Resumen del Pedido
            </h2>

            <div className="space-y-3 mb-6">
              <div className="flex justify-between text-gray-600">
                <span>Subtotal</span>
                <span>${getCartTotal().toFixed(2)}</span>
              </div>
              <div className="flex justify-between text-gray-600">
                <span>Envío</span>
                <span>Gratis</span>
              </div>
              <div className="border-t pt-3 flex justify-between font-bold text-lg">
                <span>Total</span>
                <span className="text-primary-600">
                  ${getCartTotal().toFixed(2)}
                </span>
              </div>
            </div>

            <button
              onClick={handleCheckout}
              disabled={purchasing}
              className="w-full btn-primary disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {purchasing ? 'Procesando...' : 'Proceder al Pago'}
            </button>

            <button
              onClick={() => navigate('/')}
              className="w-full btn-secondary mt-3"
            >
              Continuar Comprando
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Cart;
