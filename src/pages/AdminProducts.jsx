import { useState, useEffect } from 'react';
import { productService } from '../services/productService';
import { categoryService } from '../services/categoryService';
import toast from 'react-hot-toast';
import { Trash2, Plus, Pencil, X, Check, Package } from 'lucide-react';
import { sizeService } from '../services/sizeService';

const AdminProducts = () => {
  const [products, setProducts] = useState([]);
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [editingId, setEditingId] = useState(null);
  const [sizes, setSizes] = useState([]);
  const [selectedProduct, setSelectedProduct] = useState(null);
  const [newSize, setNewSize] = useState({ size: '', stock: '' });
  const [savingSize, setSavingSize] = useState(false);

  const [formData, setFormData] = useState({
    title: '',
    description: '',
    price: '',
    categoryId: '',
  });

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      setLoading(true);
      const [prods, cats] = await Promise.all([
        productService.getAll(),
        categoryService.getAll(),
      ]);
      setProducts(prods);
      setCategories(cats);
    } catch (error) {
      toast.error('Error al cargar los datos');
    } finally {
      setLoading(false);
    }
  };

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleCreate = async (e) => {
    e.preventDefault();
    try {
      setSaving(true);
      await productService.create(formData);
      toast.success('Producto creado exitosamente');
      setFormData({ title: '', description: '', price: '', categoryId: '' });
      await fetchData();
    } catch (error) {
      toast.error('Error al crear el producto');
    } finally {
      setSaving(false);
    }
  };

  const handleEdit = (product) => {
    setEditingId(product.id);
    setFormData({
      title: product.title,
      description: product.description,
      price: product.price,
      categoryId: product.categoryId,
    });
  };

  const handleUpdate = async (id) => {
    try {
      setSaving(true);
      await productService.update(id, formData);
      toast.success('Producto actualizado');
      setEditingId(null);
      setFormData({ title: '', description: '', price: '', categoryId: '' });
      await fetchData();
    } catch (error) {
      toast.error('Error al actualizar el producto');
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async (id) => {
    if (!confirm('¿Estás seguro de eliminar este producto?')) return;
    try {
      await productService.delete(id);
      toast.success('Producto eliminado');
      await fetchData();
    } catch (error) {
      toast.error('Error al eliminar el producto');
    }
  };

  const handleCancelEdit = () => {
    setEditingId(null);
    setFormData({ title: '', description: '', price: '', categoryId: '' });
  };

  // Funciones de tallas
  const fetchSizes = async (productId) => {
    const data = await sizeService.getAll(productId);
    setSizes(data);
  };

  const handleSelectProduct = async (product) => {
    setSelectedProduct(product);
    await fetchSizes(product.id);
  };

  const handleCreateSize = async (e) => {
    e.preventDefault();
    try {
      setSavingSize(true);
      await sizeService.create(selectedProduct.id, newSize);
      toast.success('Talla creada exitosamente');
      setNewSize({ size: '', stock: '' });
      await fetchSizes(selectedProduct.id);
    } catch (error) {
      toast.error('Error al crear la talla');
    } finally {
      setSavingSize(false);
    }
  };

  const handleDeleteSize = async (sizeId) => {
    if (!confirm('¿Estás seguro de eliminar esta talla?')) return;
    try {
      await sizeService.delete(selectedProduct.id, sizeId);
      toast.success('Talla eliminada');
      await fetchSizes(selectedProduct.id);
    } catch (error) {
      toast.error('Error al eliminar la talla');
    }
  };

  const handleUpdateStock = async (sizeId, stock) => {
    try {
      await sizeService.update(selectedProduct.id, sizeId, stock);
      toast.success('Stock actualizado');
      await fetchSizes(selectedProduct.id);
    } catch (error) {
      toast.error('Error al actualizar el stock');
    }
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <h1 className="text-3xl font-bold text-gray-900 mb-8">
        Gestionar Productos
      </h1>

      {/* Formulario para crear producto */}
      <div className="card mb-8">
        <h2 className="text-xl font-bold text-gray-900 mb-4">
          Nuevo Producto
        </h2>
        <form onSubmit={handleCreate} className="space-y-4">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Título
              </label>
              <input
                name="title"
                type="text"
                required
                className="input-field"
                placeholder="Nombre del producto"
                value={formData.title}
                onChange={handleChange}
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Precio
              </label>
              <input
                name="price"
                type="number"
                step="0.01"
                required
                className="input-field"
                placeholder="0.00"
                value={formData.price}
                onChange={handleChange}
              />
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Descripción
            </label>
            <textarea
              name="description"
              required
              className="input-field"
              placeholder="Descripción del producto"
              rows={3}
              value={formData.description}
              onChange={handleChange}
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Categoría
            </label>
            <select
              name="categoryId"
              required
              className="input-field"
              value={formData.categoryId}
              onChange={handleChange}
            >
              <option value="">Selecciona una categoría</option>
              {categories.map((cat) => (
                <option key={cat.id} value={cat.id}>
                  {cat.name}
                </option>
              ))}
            </select>
          </div>

          <button
            type="submit"
            disabled={saving}
            className="btn-primary flex items-center space-x-2 disabled:opacity-50"
          >
            <Plus className="h-4 w-4" />
            <span>{saving ? 'Guardando...' : 'Crear Producto'}</span>
          </button>
        </form>
      </div>

      {/* Lista de productos */}
      <div className="card">
        <h2 className="text-xl font-bold text-gray-900 mb-4">
          Productos existentes
        </h2>
        {loading ? (
          <p className="text-gray-500">Cargando...</p>
        ) : products.length === 0 ? (
          <p className="text-gray-500">No hay productos aún</p>
        ) : (
          <div className="space-y-4">
            {products.map((product) => (
              <div key={product.id} className="p-4 bg-gray-50 rounded-lg">
                {editingId === product.id ? (
                  <div className="space-y-3">
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                      <input
                        name="title"
                        type="text"
                        className="input-field"
                        value={formData.title}
                        onChange={handleChange}
                      />
                      <input
                        name="price"
                        type="number"
                        step="0.01"
                        className="input-field"
                        value={formData.price}
                        onChange={handleChange}
                      />
                    </div>
                    <textarea
                      name="description"
                      className="input-field"
                      rows={2}
                      value={formData.description}
                      onChange={handleChange}
                    />
                    <select
                      name="categoryId"
                      className="input-field"
                      value={formData.categoryId}
                      onChange={handleChange}
                    >
                      {categories.map((cat) => (
                        <option key={cat.id} value={cat.id}>
                          {cat.name}
                        </option>
                      ))}
                    </select>
                    <div className="flex space-x-2">
                      <button
                        onClick={() => handleUpdate(product.id)}
                        disabled={saving}
                        className="btn-primary flex items-center space-x-1 disabled:opacity-50"
                      >
                        <Check className="h-4 w-4" />
                        <span>Guardar</span>
                      </button>
                      <button
                        onClick={handleCancelEdit}
                        className="btn-secondary flex items-center space-x-1"
                      >
                        <X className="h-4 w-4" />
                        <span>Cancelar</span>
                      </button>
                    </div>
                  </div>
                ) : (
                  // Vista normal del producto
                  <div className="flex items-center justify-between">
                    <div>
                      <h3 className="font-semibold text-gray-900">{product.title}</h3>
                      <p className="text-sm text-gray-600">{product.description}</p>
                      <div className="flex items-center space-x-3 mt-1">
                        <span className="text-primary-600 font-bold">
                          ${parseFloat(product.price).toFixed(2)}
                        </span>
                        <span className="text-xs bg-primary-100 text-primary-800 px-2 py-1 rounded-full">
                          {product.category?.name || 'Sin categoría'}
                        </span>
                      </div>
                    </div>
                    <div className="flex items-center space-x-2">
                      {/* Botón gestionar tallas */}
                      <button
                        onClick={() => handleSelectProduct(product)}
                        className="text-green-600 hover:text-green-700"
                        title="Gestionar tallas"
                      >
                        <Package className="h-5 w-5" />
                      </button>
                      <button
                        onClick={() => handleEdit(product)}
                        className="text-blue-600 hover:text-blue-700"
                      >
                        <Pencil className="h-5 w-5" />
                      </button>
                      <button
                        onClick={() => handleDelete(product.id)}
                        className="text-red-600 hover:text-red-700"
                      >
                        <Trash2 className="h-5 w-5" />
                      </button>
                    </div>
                  </div>
                )}
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Gestión de tallas */}
      {selectedProduct && (
        <div className="card mt-8">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-xl font-bold text-gray-900">
              Tallas de: {selectedProduct.title}
            </h2>
            <button
              onClick={() => setSelectedProduct(null)}
              className="btn-secondary"
            >
              Cerrar
            </button>
          </div>

          {/* Formulario nueva talla */}
          <form onSubmit={handleCreateSize} className="flex space-x-4 mb-6">
            <input
              type="number"
              className="input-field"
              placeholder="Talla (ej: 35)"
              value={newSize.size}
              onChange={(e) => setNewSize({ ...newSize, size: e.target.value })}
              required
            />
            <input
              type="number"
              className="input-field"
              placeholder="Stock"
              value={newSize.stock}
              onChange={(e) => setNewSize({ ...newSize, stock: e.target.value })}
              required
            />
            <button
              type="submit"
              disabled={savingSize}
              className="btn-primary flex items-center space-x-2 disabled:opacity-50"
            >
              <Plus className="h-4 w-4" />
              <span>{savingSize ? 'Guardando...' : 'Agregar'}</span>
            </button>
          </form>

          {/* Lista de tallas */}
          {sizes.length === 0 ? (
            <p className="text-gray-500">No hay tallas registradas</p>
          ) : (
            <ul className="space-y-3">
              {sizes.map((s) => (
                <li key={s.id} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                  <span className="font-medium text-gray-900">Talla {s.size}</span>
                  <div className="flex items-center space-x-3">
                    <input
                      type="number"
                      className="input-field w-24"
                      value={s.stock}
                      onChange={(e) => handleUpdateStock(s.id, parseInt(e.target.value))}
                    />
                    <span className="text-sm text-gray-600">unidades</span>
                    <button
                      onClick={() => handleDeleteSize(s.id)}
                      className="text-red-600 hover:text-red-700"
                    >
                      <Trash2 className="h-5 w-5" />
                    </button>
                  </div>
                </li>
              ))}
            </ul>
          )}
        </div>
      )}
    </div>
  );
};

export default AdminProducts;