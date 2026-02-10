import api from './api';

export const cartService = {
  // Obtener todos los items del carrito del usuario
  getAll: async () => {
    const response = await api.get('/cart');
    return response.data;
  },

  // Obtener un item del carrito
  getOne: async (id) => {
    const response = await api.get(`/cart/${id}`);
    return response.data;
  },

  // Agregar producto al carrito
  addToCart: async (cartData) => {
    const response = await api.post('/cart', cartData);
    return response.data;
  },

  // Actualizar cantidad de un producto en el carrito
  update: async (id, quantity) => {
    const response = await api.put(`/cart/${id}`, { quantity });
    return response.data;
  },

  // Eliminar un producto del carrito
  remove: async (id) => {
    const response = await api.delete(`/cart/${id}`);
    return response.data;
  },
};
