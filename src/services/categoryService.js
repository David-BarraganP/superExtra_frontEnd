import api from './api';

export const categoryService = {
  // Obtener todas las categorías
  getAll: async () => {
    const response = await api.get('/categories');
    return response.data;
  },

  // Crear una categoría (requiere autenticación)
  create: async (categoryData) => {
    const response = await api.post('/categories', categoryData);
    return response.data;
  },

  // Eliminar una categoría (requiere autenticación)
  delete: async (id) => {
    const response = await api.delete(`/categories/${id}`);
    return response.data;
  },
};
