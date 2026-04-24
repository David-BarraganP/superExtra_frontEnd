// importaciones
import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { productService } from '../services/productService';
import { sizeService } from '../services/sizeService';
import { useCart } from '../context/CartContext';
import { useAuth } from '../context/AuthContext';
import Loader from '../components/Loader';
import toast from 'react-hot-toast';
import { ShoppingCart, ArrowLeft, Plus, Minus } from 'lucide-react';


const ProductDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { addToCart } = useCart();
  const { isAuthenticated } = useAuth();
  const [product, setProduct] = useState(null);
  const [loading, setLoading] = useState(true);
  const [quantity, setQuantity] = useState(1);
  const [selectedImage, setSelectedImage] = useState(0);
  const [sizes, setSizes] = useState([]);
  const [selectedSize, setSelectedSize] = useState(null);

  useEffect(() => {
    fetchProduct();
  }, [id]);

  const fetchProduct = async () => {
    try {
      setLoading(true);
      const data = await productService.getOne(id);
      setProduct(data);
      // Cargar tallas del producto
      const sizesData = await sizeService.getAll(id);
      setSizes(sizesData);
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
    if (sizes.length > 0 && !selectedSize) {
      toast.error('Por favor selecciona una talla');
      return;
    }
    if (selectedSize && selectedSize.stock === 0) {
      toast.error('No hay stock disponible para esta talla');
      return;
    }
    // Se envía el sizeId seleccionado
    addToCart(product.id, quantity, selectedSize?.id);
  };

  const incrementQuantity = () => {
    if (selectedSize && quantity >= selectedSize.stock) {
      toast.error(`Solo hay ${selectedSize.stock} unidades disponibles`);
      return;
    }
    setQuantity(q => q + 1);
  };

  const decrementQuantity = () => setQuantity(q => Math.max(1, q - 1));

  const getProductImages = () => {
    if (product?.productImgs && product.productImgs.length > 0) {
      return product.productImgs.map(img => img.url);
    }
    return ['https://placehold.co/400x400?text=Sin+imagen'];
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
        {/* Imágenes */}
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

        {/* Información del producto */}
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

          <p className="text-gray-600">{product.description}</p>

          {/* Selector de tallas */}
          {sizes.length > 0 && (
            <div className="space-y-2">
              <label className="block text-sm font-medium text-gray-700">
                Selecciona tu talla
              </label>
              <div className="flex flex-wrap gap-2">
                {sizes.map((s) => (
                  <button
                    key={s.id}
                    onClick={() => {
                      setSelectedSize(s);
                      setQuantity(1);
                    }}
                    disabled={s.stock === 0}
                    className={`px-4 py-2 rounded-lg border-2 font-medium transition-colors
                      ${s.stock === 0
                        ? 'border-gray-200 text-gray-400 cursor-not-allowed line-through'
                        : selectedSize?.id === s.id
                          ? 'border-primary-600 bg-primary-600 text-white'
                          : 'border-gray-300 text-gray-700 hover:border-primary-600'
                      }`}
                  >
                    {s.size}
                  </button>
                ))}
              </div>
              {selectedSize && (
                <p className="text-sm text-gray-500">
                  Stock disponible: {selectedSize.stock} unidades
                </p>
              )}
            </div>
          )}

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
