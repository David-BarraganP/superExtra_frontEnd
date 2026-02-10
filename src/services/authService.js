import api from './api';

export const authService = {
  // Registrar nuevo usuario
  register: async (userData) => {
    const response = await api.post('/users', userData);
    return response.data;
  },

  // Iniciar sesión
  login: async (credentials) => {
    const response = await api.post('/users/login', credentials);
    if (response.data.token) {
      localStorage.setItem('token', response.data.token);
      localStorage.setItem('user', JSON.stringify(response.data.user));
    }
    return response.data;
  },

  // Cerrar sesión
  logout: () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
  },

  // Obtener usuario actual
  getCurrentUser: () => {
    const userStr = localStorage.getItem('user');
    return userStr ? JSON.parse(userStr) : null;
  },

  // Verificar si el usuario está autenticado
  isAuthenticated: () => {
    return !!localStorage.getItem('token');
  },
};
