import api from './api';

export const productImgService = {
  // Obtener todas las imágenes
  getAll: async () => {
    const response = await api.get('/product_images');
    return response.data;
  },

  // Subir una imagen a Cloudinary
  create: async (formData) => {
    const response = await api.post('/product_images', formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    });
    return response.data;
  },

  // Eliminar una imagen
  delete: async (id) => {
    const response = await api.delete(`/product_images/${id}`);
    return response.data;
  },

  // Asignar imágenes a un producto
  setImages: async (productId, imageIds) => {
    const response = await api.post(`/products/${productId}/images`, imageIds);
    return response.data;
  },
};