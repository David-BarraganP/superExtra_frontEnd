import { useState, useEffect } from 'react';
import { categoryService } from '../services/categoryService';
import toast from 'react-hot-toast';
import { Trash2, Plus } from 'lucide-react';

const AdminCategories = () => {
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [newCategory, setNewCategory] = useState('');
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    fetchCategories();
  }, []);

  const fetchCategories = async () => {
    try {
      setLoading(true);
      const data = await categoryService.getAll();
      setCategories(data);
    } catch (error) {
      toast.error('Error al cargar las categorías');
    } finally {
      setLoading(false);
    }
  };

  const handleCreate = async (e) => {
    e.preventDefault();
    if (!newCategory.trim()) return;
    try {
      setSaving(true);
      await categoryService.create({ name: newCategory });
      toast.success('Categoría creada exitosamente');
      setNewCategory('');
      await fetchCategories();
    } catch (error) {
      toast.error('Error al crear la categoría');
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async (id) => {
    if (!confirm('¿Estás seguro de eliminar esta categoría?')) return;
    try {
      await categoryService.delete(id);
      toast.success('Categoría eliminada');
      await fetchCategories();
    } catch (error) {
      toast.error('Error al eliminar la categoría');
    }
  };

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <h1 className="text-3xl font-bold text-gray-900 mb-8">
        Gestionar Categorías
      </h1>

      {/* Formulario para crear categoría */}
      <div className="card mb-8">
        <h2 className="text-xl font-bold text-gray-900 mb-4">
          Nueva Categoría
        </h2>
        <form onSubmit={handleCreate} className="flex space-x-4">
          <input
            type="text"
            className="input-field flex-1"
            placeholder="Nombre de la categoría"
            value={newCategory}
            onChange={(e) => setNewCategory(e.target.value)}
          />
          <button
            type="submit"
            disabled={saving}
            className="btn-primary flex items-center space-x-2 disabled:opacity-50"
          >
            <Plus className="h-4 w-4" />
            <span>{saving ? 'Guardando...' : 'Agregar'}</span>
          </button>
        </form>
      </div>

      {/* Lista de categorías */}
      <div className="card">
        <h2 className="text-xl font-bold text-gray-900 mb-4">
          Categorías existentes
        </h2>
        {loading ? (
          <p className="text-gray-500">Cargando...</p>
        ) : categories.length === 0 ? (
          <p className="text-gray-500">No hay categorías aún</p>
        ) : (
          <ul className="space-y-3">
            {categories.map((category) => (
              <li
                key={category.id}
                className="flex items-center justify-between p-3 bg-gray-50 rounded-lg"
              >
                <span className="font-medium text-gray-900">{category.name}</span>
                <button
                  onClick={() => handleDelete(category.id)}
                  className="text-red-600 hover:text-red-700"
                >
                  <Trash2 className="h-5 w-5" />
                </button>
              </li>
            ))}
          </ul>
        )}
      </div>
    </div>
  );
};

export default AdminCategories;