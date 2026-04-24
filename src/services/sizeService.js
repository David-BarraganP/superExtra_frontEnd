import api from './api';

export const sizeService = {
  // Obtener todas las tallas de un producto
  getAll: async (productId) => {
    const response = await api.get(`/products/${productId}/sizes`);
    return response.data;
  },

  // Crear una talla para un producto
  create: async (productId, sizeData) => {
    const response = await api.post(`/products/${productId}/sizes`, sizeData);
    return response.data;
  },

  // Actualizar stock de una talla
  update: async (productId, id, stock) => {
    const response = await api.put(`/products/${productId}/sizes/${id}`, { stock });
    return response.data;
  },

  // Eliminar una talla
  delete: async (productId, id) => {
    const response = await api.delete(`/products/${productId}/sizes/${id}`);
    return response.data;
  },
};