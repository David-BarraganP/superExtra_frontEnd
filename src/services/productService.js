import api from './api';

export const productService = {
  // Obtener todos los productos
  getAll: async (categoryId = null) => {
    const params = categoryId ? { category: categoryId } : {};
    const response = await api.get('/products', { params });
    return response.data;
  },

  // Obtener un producto por ID
  getOne: async (id) => {
    const response = await api.get(`/products/${id}`);
    return response.data;
  },

  // Crear un producto (requiere autenticación)
  create: async (productData) => {
    const response = await api.post('/products', productData);
    return response.data;
  },

  // Actualizar un producto (requiere autenticación)
  update: async (id, productData) => {
    const response = await api.put(`/products/${id}`, productData);
    return response.data;
  },

  // Eliminar un producto (requiere autenticación)
  delete: async (id) => {
    const response = await api.delete(`/products/${id}`);
    return response.data;
  },

  // Asignar imágenes a un producto
  setImages: async (id, imageIds) => {
    const response = await api.post(`/products/${id}/images`, imageIds);
    return response.data;
  },
};