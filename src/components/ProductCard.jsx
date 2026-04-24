// impórtaciones
import { ShoppingCart } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { useCart } from '../context/CartContext';
import { useAuth } from '../context/AuthContext';
import toast from 'react-hot-toast';

// Tarjeta individual de producto con imagen, info y botón de agregar al carrito
const ProductCard = ({ product }) => {
  const navigate = useNavigate();
  const { addToCart } = useCart();
  const { isAuthenticated } = useAuth();

  // Agrega el producto al carrito; redirige al login si el usuario no está autenticado
  const handleAddToCart = (e) => {
    e.stopPropagation();
    if (!isAuthenticated) {
      toast.error('Debes iniciar sesión para agregar productos al carrito');
      navigate('/login');
      return;
    }
    navigate(`/products/${product.id}`);
  };

  // Redirige al detalle del producto al hacer click en la tarjeta
  const handleCardClick = () => {
    navigate(`/products/${product.id}`);
  };

  // Retorna la primera imagen del producto o un placeholder si no tiene
  const getProductImage = () => {
    if (product.productImgs && product.productImgs.length > 0) {
      return product.productImgs[0].url;
    }
    return 'https://placehold.co/400x400?text=Sin+imagen';
  };

  return (
    <div 
      onClick={handleCardClick}
      className="card cursor-pointer group"
    >
      {/* Imagen */}
      <div className="relative overflow-hidden rounded-lg mb-4 h-48 bg-gray-100">
        <img
          src={getProductImage()}
          alt={product.title}
          className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-300"
        />
        {product.category && (
          <span className="absolute top-2 right-2 bg-primary-600 text-white text-xs px-2 py-1 rounded-full">
            {product.category.name}
          </span>
        )}
      </div>

      {/* Contentido */}
      <div className="space-y-2">
        <h3 className="font-semibold text-lg text-gray-900 line-clamp-2">
          {product.title}
        </h3>
        <p className="text-gray-600 text-sm line-clamp-2">
          {product.description}
        </p>
        
        {/* Precio y añadir al carrito */}
        <div className="flex items-center justify-between pt-2">
          <span className="text-2xl font-bold text-primary-600">
            ${parseFloat(product.price).toFixed(2)}
          </span>
          <button
            onClick={handleAddToCart}
            className="btn-primary flex items-center space-x-2 px-3 py-2"
          >
            <ShoppingCart className="h-4 w-4" />
            <span>Agregar</span>
          </button>
        </div>
      </div>
    </div>
  );
};

export default ProductCard;