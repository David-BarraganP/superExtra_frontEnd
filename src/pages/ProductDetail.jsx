// importaciones
import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { productService } from '../services/productService';
import { useCart } from '../context/CartContext';
import { useAuth } from '../context/AuthContext';
import Loader from '../components/Loader';
import toast from 'react-hot-toast';
import { ShoppingCart, ArrowLeft, Plus, Minus } from 'lucide-react';


// Página de detalle de un producto con galería de imágenes, selector de cantidad y botón de compra
const ProductDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { addToCart } = useCart();
  const { isAuthenticated } = useAuth();
  const [product, setProduct] = useState(null);
  const [loading, setLoading] = useState(true);
  const [quantity, setQuantity] = useState(1);
  const [selectedImage, setSelectedImage] = useState(0);

  useEffect(() => {
    fetchProduct();
  }, [id]);

   // Obtiene los datos del producto por ID; redirige al inicio si ocurre un error 
  const fetchProduct = async () => {
    try {
      setLoading(true);
      const data = await productService.getOne(id);
      setProduct(data);
    } catch (error) {
      console.error('Error fetching product:', error);
      toast.error('Error al cargar el producto');
      navigate('/');
    } finally {
      setLoading(false);
    }
  };

  // Agrega el producto al carrito; redirige al login si el usuario no está autenticado
  const handleAddToCart = () => {
    if (!isAuthenticated) {
      toast.error('Debes iniciar sesión para agregar productos al carrito');
      navigate('/login');
      return;
    }
    addToCart(product.id, quantity);
  };

  const incrementQuantity = () => setQuantity(q => q + 1);
  const decrementQuantity = () => setQuantity(q => Math.max(1, q - 1));

    // Retorna el arreglo de imágenes del producto o un placeholder si no tiene
  const getProductImages = () => {
    if (product?.productImgs && product.productImgs.length > 0) {
      return product.productImgs.map(img => img.url);
    }
    // return ['https://via.placeholder.com/600x600?text=No+Image'];
    return <a href="https://www.flaticon.com/free-icons/product-details" ></a>;
  };

  if (loading) {
    return <Loader />;
  }

  if (!product) {
    return null;
  }

  const images = getProductImages();

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      {/* Botón Atrás */}
      <button
        onClick={() => navigate('/')}
        className="flex items-center space-x-2 text-gray-600 hover:text-primary-600 mb-6"
      >
        <ArrowLeft className="h-5 w-5" />
        <span>Volver a productos</span>
      </button>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        {/* Images */}
        <div className="space-y-4">
          <div className="aspect-square rounded-lg overflow-hidden bg-gray-100">
            <img
              src={images[selectedImage]}
              alt={product.title}
              className="w-full h-full object-cover"
            />
          </div>
          {images.length > 1 && (
            <div className="grid grid-cols-4 gap-2">
              {images.map((image, index) => (
                <button
                  key={index}
                  onClick={() => setSelectedImage(index)}
                  className={`aspect-square rounded-lg overflow-hidden bg-gray-100 border-2 ${
                    selectedImage === index
                      ? 'border-primary-600'
                      : 'border-transparent'
                  }`}
                >
                  <img
                    src={image}
                    alt={`${product.title} ${index + 1}`}
                    className="w-full h-full object-cover"
                  />
                </button>
              ))}
            </div>
          )}
        </div>

        {/* informacion del producto */}
        <div className="space-y-6">
          {product.category && (
            <span className="inline-block bg-primary-100 text-primary-800 text-sm px-3 py-1 rounded-full">
              {product.category.name}
            </span>
          )}

          <h1 className="text-3xl font-bold text-gray-900">
            {product.title}
          </h1>

          <div className="text-4xl font-bold text-primary-600">
            ${parseFloat(product.price).toFixed(2)}
          </div>

          <div className="prose prose-sm">
            <p className="text-gray-600">{product.description}</p>
          </div>

          {/* Selector de cantidad */}
          <div className="space-y-2">
            <label className="block text-sm font-medium text-gray-700">
              Cantidad
            </label>
            <div className="flex items-center space-x-3">
              <button
                onClick={decrementQuantity}
                className="p-2 rounded-lg border border-gray-300 hover:bg-gray-100"
              >
                <Minus className="h-4 w-4" />
              </button>
              <span className="text-xl font-semibold w-12 text-center">
                {quantity}
              </span>
              <button
                onClick={incrementQuantity}
                className="p-2 rounded-lg border border-gray-300 hover:bg-gray-100"
              >
                <Plus className="h-4 w-4" />
              </button>
            </div>
          </div>

          {/* Botón Añadir al carrito */}
          <button
            onClick={handleAddToCart}
            className="w-full btn-primary flex items-center justify-center space-x-2 py-3"
          >
            <ShoppingCart className="h-5 w-5" />
            <span>Agregar al Carrito</span>
          </button>
        </div>
      </div>
    </div>
  );
};

export default ProductDetail;
