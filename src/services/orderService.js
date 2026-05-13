import api from './api';

export const orderService = {
  // Obtener todas las órdenes del usuario
  getAll: async () => {
    const response = await api.get('/orders');
    return response.data;
  },

  // Crear una orden desde el carrito
  create: async (orderData) => {
    const response = await api.post('/orders', orderData);
    return response.data;
  },

  // Actualizar estado de una orden (solo admin)
  updateStatus: async (id, status) => {
    const response = await api.put(`/orders/${id}`, { status });
    return response.data;
  },
};