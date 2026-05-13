import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useCart } from '../context/CartContext';
import { orderService } from '../services/orderService';
import toast from 'react-hot-toast';
import { ShoppingBag, Truck, Store } from 'lucide-react';

const Checkout = () => {
  const navigate = useNavigate();
  const { cartItems, getCartTotal, fetchCart } = useCart();
  const [loading, setLoading] = useState(false);
  const [deliveryType, setDeliveryType] = useState('delivery');

  const [formData, setFormData] = useState({
    phone: '',
    address: '',
    city: '',
  });

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      setLoading(true);
      await orderService.create({
        deliveryType,
        phone: formData.phone,
        address: deliveryType === 'delivery' ? formData.address : null,
        city: deliveryType === 'delivery' ? formData.city : null,
      });
      toast.success('¡Orden creada exitosamente!');
      await fetchCart();
      navigate('/orders');
    } catch (error) {
      toast.error('Error al crear la orden');
    } finally {
      setLoading(false);
    }
  };

  if (cartItems.length === 0) {
    navigate('/');
    return null;
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <h1 className="text-3xl font-bold text-gray-900 mb-8">
        Finalizar Compra
      </h1>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Formulario */}
        <div className="space-y-6">

          {/* Tipo de entrega */}
          <div className="card">
            <h2 className="text-xl font-bold text-gray-900 mb-4">
              Tipo de entrega
            </h2>
            <div className="grid grid-cols-2 gap-4">
              <button
                type="button"
                onClick={() => setDeliveryType('delivery')}
                className={`p-4 rounded-lg border-2 flex flex-col items-center space-y-2 transition-colors ${
                  deliveryType === 'delivery'
                    ? 'border-primary-600 bg-primary-50'
                    : 'border-gray-200 hover:border-primary-300'
                }`}
              >
                <Truck className={`h-6 w-6 ${deliveryType === 'delivery' ? 'text-primary-600' : 'text-gray-400'}`} />
                <span className={`font-medium ${deliveryType === 'delivery' ? 'text-primary-600' : 'text-gray-600'}`}>
                  Envío a domicilio
                </span>
              </button>

              <button
                type="button"
                onClick={() => setDeliveryType('pickup')}
                className={`p-4 rounded-lg border-2 flex flex-col items-center space-y-2 transition-colors ${
                  deliveryType === 'pickup'
                    ? 'border-primary-600 bg-primary-50'
                    : 'border-gray-200 hover:border-primary-300'
                }`}
              >
                <Store className={`h-6 w-6 ${deliveryType === 'pickup' ? 'text-primary-600' : 'text-gray-400'}`} />
                <span className={`font-medium ${deliveryType === 'pickup' ? 'text-primary-600' : 'text-gray-600'}`}>
                  Recoger en tienda
                </span>
              </button>
            </div>
          </div>

          {/* Datos de contacto */}
          <div className="card">
            <h2 className="text-xl font-bold text-gray-900 mb-4">
              Datos de contacto
            </h2>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Teléfono
                </label>
                <input
                  name="phone"
                  type="tel"
                  required
                  className="input-field"
                  placeholder="3001234567"
                  value={formData.phone}
                  onChange={handleChange}
                />
              </div>

              {/* Campos de envío solo si es delivery */}
              {deliveryType === 'delivery' && (
                <>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Dirección
                    </label>
                    <input
                      name="address"
                      type="text"
                      required
                      className="input-field"
                      placeholder="Calle 123 # 45-67"
                      value={formData.address}
                      onChange={handleChange}
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Ciudad
                    </label>
                    <input
                      name="city"
                      type="text"
                      required
                      className="input-field"
                      placeholder="Bogotá"
                      value={formData.city}
                      onChange={handleChange}
                    />
                  </div>
                </>
              )}

              <button
                type="submit"
                disabled={loading}
                className="w-full btn-primary disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {loading ? 'Procesando...' : 'Confirmar Orden'}
              </button>
            </form>
          </div>
        </div>

        {/* Resumen del pedido */}
        <div className="card h-fit sticky top-20">
          <h2 className="text-xl font-bold text-gray-900 mb-4">
            Resumen del Pedido
          </h2>

          <div className="space-y-3 mb-6">
            {cartItems.map((item) => (
              <div key={item.id} className="flex justify-between items-center">
                <div>
                  <p className="font-medium text-gray-900">{item.product?.title}</p>
                  {item.sizeId && item.product?.sizes && (
                    <p className="text-sm text-gray-500">
                      Talla: {item.product.sizes.find(s => s.id === item.sizeId)?.size}
                    </p>
                  )}
                  <p className="text-sm text-gray-500">Cantidad: {item.quantity}</p>
                </div>
                <p className="font-semibold text-gray-900">
                  ${(parseFloat(item.product?.price || 0) * item.quantity).toFixed(2)}
                </p>
              </div>
            ))}
          </div>

          <div className="border-t pt-4 space-y-2">
            <div className="flex justify-between text-gray-600">
              <span>Subtotal</span>
              <span>${getCartTotal().toFixed(2)}</span>
            </div>
            <div className="flex justify-between text-gray-600">
              <span>Envío</span>
              <span>Gratis</span>
            </div>
            <div className="flex justify-between font-bold text-lg border-t pt-2">
              <span>Total</span>
              <span className="text-primary-600">${getCartTotal().toFixed(2)}</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Checkout;