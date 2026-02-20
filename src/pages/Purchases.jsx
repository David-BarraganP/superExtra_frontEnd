import { useState, useEffect } from 'react';
import { purchaseService } from '../services/purchaseService';
import Loader from '../components/Loader';
import toast from 'react-hot-toast';
import { Package, Calendar } from 'lucide-react';

const Purchases = () => {
  const [purchases, setPurchases] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchPurchases();
  }, []);

  const fetchPurchases = async () => {
    try {
      setLoading(true);
      const data = await purchaseService.getAll();
      setPurchases(data);
    } catch (error) {
      console.error('Error fetching purchases:', error);
      toast.error('Error al cargar las compras');
    } finally {
      setLoading(false);
    }
  };

  const getProductImage = (product) => {
    if (product?.productImgs && product.productImgs.length > 0) {
      return product.productImgs[0].url;
    }
    return 'https://via.placeholder.com/100x100?text=No+Image';
  };

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('es-ES', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
    });
  };

  // Group purchases by date
  const groupedPurchases = purchases.reduce((acc, purchase) => {
    const date = new Date(purchase.createdAt).toDateString();
    if (!acc[date]) {
      acc[date] = [];
    }
    acc[date].push(purchase);
    return acc;
  }, {});

  if (loading) {
    return <Loader />;
  }

  if (purchases.length === 0) {
    return (
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="text-center">
          <Package className="mx-auto h-12 w-12 text-gray-400" />
          <h2 className="mt-4 text-2xl font-bold text-gray-900">
            No tienes compras aún
          </h2>
          <p className="mt-2 text-gray-600">
            ¡Comienza a comprar ahora!
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <h1 className="text-3xl font-bold text-gray-900 mb-8">
        Mis Compras
      </h1>

      <div className="space-y-8">
        {Object.entries(groupedPurchases).map(([date, items]) => {
          const totalAmount = items.reduce(
            (sum, item) => sum + parseFloat(item.product?.price || 0) * item.quantity,
            0
          );

          return (
            <div key={date} className="space-y-4">
              {/* Date Header */}
              <div className="flex items-center justify-between border-b pb-3">
                <div className="flex items-center space-x-2 text-gray-700">
                  <Calendar className="h-5 w-5" />
                  <span className="font-semibold">
                    {formatDate(items[0].createdAt)}
                  </span>
                </div>
                <div className="text-right">
                  <p className="text-sm text-gray-600">Total del pedido</p>
                  <p className="font-bold text-lg text-primary-600">
                    ${totalAmount.toFixed(2)}
                  </p>
                </div>
              </div>

              {/* Purchase Items */}
              <div className="grid grid-cols-1 gap-4">
                {items.map((purchase) => (
                  <div key={purchase.id} className="card flex items-center space-x-4">
                    {/* Image */}
                    <img
                      src={getProductImage(purchase.product)}
                      alt={purchase.product?.title}
                      className="w-20 h-20 object-cover rounded-lg"
                    />

                    {/* Info */}
                    <div className="flex-1">
                      <h3 className="font-semibold text-gray-900">
                        {purchase.product?.title}
                      </h3>
                      <p className="text-gray-600 text-sm">
                        {purchase.product?.category?.name}
                      </p>
                      <p className="text-sm text-gray-500 mt-1">
                        Cantidad: {purchase.quantity}
                      </p>
                    </div>

                    {/* Price */}
                    <div className="text-right">
                      <p className="text-sm text-gray-600">Precio unitario</p>
                      <p className="font-semibold text-gray-900">
                        ${parseFloat(purchase.product?.price || 0).toFixed(2)}
                      </p>
                      <p className="text-sm text-gray-500 mt-1">
                        Total: ${(parseFloat(purchase.product?.price || 0) * purchase.quantity).toFixed(2)}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default Purchases;