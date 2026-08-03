import { api } from './api';

export const productService = {
  getAll: (params = {}) => api.get('/products', { params }),
  getTopSelling: (limit = 8) => api.get('/products/top-selling', { params: { limit } }),
  getById: (id) => api.get(`/products/${id}`),
  getReviews: (id, params = {}) => api.get(`/products/${id}/reviews`, { params }),
  addReview: (id, data) => api.post(`/products/${id}/reviews`, data),
  deleteReview: (reviewId) => api.delete(`/reviews/${reviewId}`),
  isFavorite: (id) => api.get(`/products/${id}/is-favorite`),
  getMyProducts: (params = {}) => api.get('/products/my-products', { params }),
  create: (formData) => api.post('/products', formData),
  update: (id, formData) => {
    if (formData instanceof FormData) {
      formData.append('_method', 'PUT');
      return api.post(`/products/${id}`, formData);
    }
    return api.put(`/products/${id}`, formData);
  },
  delete: (id) => api.delete(`/products/${id}`),
};
