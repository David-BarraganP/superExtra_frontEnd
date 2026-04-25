import { useState, useEffect } from 'react';
import { productService } from '../services/productService';
import { productImgService } from '../services/productImgService';
import toast from 'react-hot-toast';
import { Trash2, Upload, Image } from 'lucide-react';
import Loader from '../components/Loader';

const AdminImages = () => {
  const [products, setProducts] = useState([]);
  const [images, setImages] = useState([]);
  const [loading, setLoading] = useState(true);
  const [uploading, setUploading] = useState(false);
  const [selectedProduct, setSelectedProduct] = useState('');
  const [selectedFile, setSelectedFile] = useState(null);
  const [preview, setPreview] = useState(null);

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      setLoading(true);
      const [prods, imgs] = await Promise.all([
        productService.getAll(),
        productImgService.getAll(),
      ]);
      setProducts(prods);
      setImages(imgs);
    } catch (error) {
      toast.error('Error al cargar los datos');
    } finally {
      setLoading(false);
    }
  };

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (!file) return;
    setSelectedFile(file);
    // Mostrar preview de la imagen seleccionada
    const reader = new FileReader();
    reader.onloadend = () => setPreview(reader.result);
    reader.readAsDataURL(file);
  };

  const handleUpload = async (e) => {
    e.preventDefault();
    if (!selectedFile) {
      toast.error('Por favor selecciona una imagen');
      return;
    }
    if (!selectedProduct) {
      toast.error('Por favor selecciona un producto');
      return;
    }

    try {
      setUploading(true);

      // 1. Subir imagen a Cloudinary
      const formData = new FormData();
      formData.append('image', selectedFile);
      const newImage = await productImgService.create(formData);

      // 2. Obtener imágenes actuales del producto
      const product = products.find(p => p.id === parseInt(selectedProduct));
      const currentImageIds = product?.productImgs?.map(img => img.id) || [];

      // 3. Asignar la nueva imagen al producto
      await productImgService.setImages(selectedProduct, [...currentImageIds, newImage.id]);

      toast.success('Imagen subida y asignada exitosamente');
      setSelectedFile(null);
      setPreview(null);
      setSelectedProduct('');
      await fetchData();
    } catch (error) {
      toast.error('Error al subir la imagen');
    } finally {
      setUploading(false);
    }
  };

  const handleDelete = async (id) => {
    if (!confirm('¿Estás seguro de eliminar esta imagen?')) return;
    try {
      await productImgService.delete(id);
      toast.success('Imagen eliminada');
      await fetchData();
    } catch (error) {
      toast.error('Error al eliminar la imagen');
    }
  };

  if (loading) return <Loader />;

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <h1 className="text-3xl font-bold text-gray-900 mb-8">
        Gestionar Imágenes
      </h1>

      {/* Formulario para subir imagen */}
      <div className="card mb-8">
        <h2 className="text-xl font-bold text-gray-900 mb-4">
          Subir Nueva Imagen
        </h2>
        <form onSubmit={handleUpload} className="space-y-4">
          
          {/* Selector de producto */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Producto
            </label>
            <select
              className="input-field"
              value={selectedProduct}
              onChange={(e) => setSelectedProduct(e.target.value)}
              required
            >
              <option value="">Selecciona un producto</option>
              {products.map((product) => (
                <option key={product.id} value={product.id}>
                  {product.title}
                </option>
              ))}
            </select>
          </div>

          {/* Input de imagen */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Imagen
            </label>
            <input
              type="file"
              accept="image/*"
              onChange={handleFileChange}
              className="input-field"
              required
            />
          </div>

          {/* Preview de la imagen */}
          {preview && (
            <div className="mt-2">
              <p className="text-sm text-gray-600 mb-2">Vista previa:</p>
              <img
                src={preview}
                alt="preview"
                className="w-40 h-40 object-cover rounded-lg border border-gray-300"
              />
            </div>
          )}

          <button
            type="submit"
            disabled={uploading}
            className="btn-primary flex items-center space-x-2 disabled:opacity-50"
          >
            <Upload className="h-4 w-4" />
            <span>{uploading ? 'Subiendo...' : 'Subir Imagen'}</span>
          </button>
        </form>
      </div>

      {/* Lista de imágenes */}
      <div className="card">
        <h2 className="text-xl font-bold text-gray-900 mb-4">
          Imágenes subidas
        </h2>
        {images.length === 0 ? (
          <div className="text-center py-8">
            <Image className="mx-auto h-12 w-12 text-gray-400 mb-3" />
            <p className="text-gray-500">No hay imágenes subidas aún</p>
          </div>
        ) : (
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4">
            {images.map((image) => (
              <div key={image.id} className="relative group">
                <img
                  src={image.url}
                  alt={`imagen-${image.id}`}
                  className="w-full h-40 object-cover rounded-lg border border-gray-200"
                />
                <button
                  onClick={() => handleDelete(image.id)}
                  className="absolute top-2 right-2 bg-red-600 text-white p-1 rounded-lg opacity-0 group-hover:opacity-100 transition-opacity"
                >
                  <Trash2 className="h-4 w-4" />
                </button>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default AdminImages;