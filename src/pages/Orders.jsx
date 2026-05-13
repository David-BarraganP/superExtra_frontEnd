import { useState, useEffect } from 'react';
import { orderService } from '../services/orderService';
import toast from 'react-hot-toast';
import Loader from '../components/Loader';
import { ShoppingBag } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

const statusLabels = {
  pending: { label: 'Pendiente', color: 'bg-yellow-100 text-yellow-800' },
  shipped: { label: 'Enviado', color: 'bg-blue-100 text-blue-800' },
  delivered: { label: 'Entregado', color: 'bg-green-100 text-green-800' },
  ready_pickup: { label: 'Listo para recoger', color: 'bg-purple-100 text-purple-800' },
};

const Orders = () => {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    fetchOrders();
  }, []);

  const fetchOrders = async () => {
    try {
      setLoading(true);
      const data = await orderService.getAll();
      setOrders(data);
    } catch (error) {
      toast.error('Error al cargar las órdenes');
    } finally {
      setLoading(false);
    }
  };

  if (loading) return <Loader />;

  if (orders.length === 0) {
    return (
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="text-center">
          <ShoppingBag className="mx-auto h-12 w-12 text-gray-400" />
          <h2 className="mt-4 text-2xl font-bold text-gray-900">
            No tienes órdenes aún
          </h2>
          <p className="mt-2 text-gray-600">
            ¡Comienza a comprar!
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
        Mis Órdenes
      </h1>

      <div className="space-y-4">
        {orders.map((order) => (
          <div key={order.id} className="card">
            <div className="flex items-center justify-between mb-4">
              <div>
                <h3 className="font-bold text-gray-900">Orden #{order.id}</h3>
                <p className="text-sm text-gray-500">
                  {new Date(order.createdAt).toLocaleDateString('es-CO', {
                    year: 'numeric',
                    month: 'long',
                    day: 'numeric'
                  })}
                </p>
              </div>
              <span className={`px-3 py-1 rounded-full text-sm font-medium ${statusLabels[order.status]?.color}`}>
                {statusLabels[order.status]?.label}
              </span>
            </div>

            <div className="border-t pt-4 space-y-2">
              <div className="flex justify-between text-gray-600">
                <span>Tipo de entrega</span>
                <span>{order.deliveryType === 'delivery' ? 'Envío a domicilio' : 'Recoger en tienda'}</span>
              </div>
              {order.address && (
                <div className="flex justify-between text-gray-600">
                  <span>Dirección</span>
                  <span>{order.address}, {order.city}</span>
                </div>
              )}
              <div className="flex justify-between text-gray-600">
                <span>Teléfono</span>
                <span>{order.phone}</span>
              </div>
              <div className="flex justify-between font-bold text-lg border-t pt-2">
                <span>Total</span>
                <span className="text-primary-600">${parseFloat(order.total).toFixed(2)}</span>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Orders;