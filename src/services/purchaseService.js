import api from './api';

export const purchaseService = {
  // Obtener todas las compras del usuario
  getAll: async () => {
    const response = await api.get('/purchase');
    return response.data;
  },

  // Crear una nueva compra (convierte el carrito en compra)
  create: async () => {
    const response = await api.post('/purchase');
    return response.data;
  },
};